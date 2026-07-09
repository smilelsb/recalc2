import { useMemo, useState } from 'react';
import CheckIcon from '~icons/lucide/check';

import IOLine from '~/components/recalc/blocks';
import CalcHeading from '~/components/recalc/calcHeading';
import BooleanInput from '~/components/recalc/io/boolean';
import {
  MeasurementInput,
  MeasurementOutput,
} from '~/components/recalc/io/measurement';
import NumberInput, { NumberOutput } from '~/components/recalc/io/number';
import { StringSelectInput } from '~/components/recalc/io/stringSelect';
import { SprocketTable } from '~/components/recalc/sprocketTable';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useQueryParams, useSerializedState } from '~/lib/hooks';
import { buildCalculatorApp, buildJsonLd, buildWebPage } from '~/lib/jsonld';
import { calculateCenters } from '~/lib/math/chains';
import Measurement from '~/lib/models/Measurement';
import { SimpleSprocket } from '~/lib/models/Sprocket';
import { buildMeta, pageUrl } from '~/lib/seo';
import {
  BooleanParam,
  MeasurementParam,
  NumberParam,
  StringParam,
} from '~/lib/types/queryParams';

const CHAINS_PATH = '/zh/chains';
const CHAINS_TITLE = '链条计算器 | ReCalc 中文版';
const CHAINS_NAME = '链条计算器';
const CHAINS_DESCRIPTION =
  '用于 FRC 和 FTC 机器人链条传动设计的中文计算器，可估算链节数、中心距，并查找兼容的 COTS 链轮组合。';

export function meta() {
  return [
    ...buildMeta({
      path: CHAINS_PATH,
      title: CHAINS_TITLE,
      description: CHAINS_DESCRIPTION,
    }),
    {
      'script:ld+json': buildJsonLd(
        buildWebPage({
          url: pageUrl(CHAINS_PATH),
          name: CHAINS_NAME,
          description: CHAINS_DESCRIPTION,
          breadcrumbLabel: CHAINS_NAME,
        }),
        buildCalculatorApp({
          url: pageUrl(CHAINS_PATH),
          name: CHAINS_NAME,
          description: CHAINS_DESCRIPTION,
        }),
      ),
    },
  ];
}

const DEFAULT_PARAMS = {
  chain: StringParam.withDefault('#25'),
  p1Teeth: NumberParam.withDefault(16),
  p2Teeth: NumberParam.withDefault(36),
  desiredCenter: MeasurementParam.withDefault(new Measurement(127, 'mm')),
  extraCenter: MeasurementParam.withDefault(new Measurement(0, 'mm')),
  allowHalfLinks: BooleanParam.withDefault(false),
};

function SuggestedBadge() {
  return (
    <span className="flex items-center gap-1 rounded border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-xs text-green-700 dark:text-green-400">
      <CheckIcon className="size-3" />
      建议
    </span>
  );
}

export default function ChineseChains() {
  const queryParams = useQueryParams(DEFAULT_PARAMS);

  const [chain, setChain] = useState(queryParams.chain);
  const [p1Teeth, setP1Teeth] = useState(queryParams.p1Teeth);
  const [p2Teeth, setP2Teeth] = useState(queryParams.p2Teeth);
  const [desiredCenter, setDesiredCenter] = useState(queryParams.desiredCenter);
  const [extraCenter, setExtraCenter] = useState(queryParams.extraCenter);
  const [allowHalfLinks, setAllowHalfLinks] = useState(
    queryParams.allowHalfLinks,
  );

  const p1PitchDiameter = useMemo(() => {
    return new SimpleSprocket(p1Teeth, chain).pitchDiameter;
  }, [p1Teeth, chain]);

  const p2PitchDiameter = useMemo(() => {
    return new SimpleSprocket(p2Teeth, chain).pitchDiameter;
  }, [p2Teeth, chain]);

  const results = useMemo(
    () =>
      calculateCenters(chain, p1Teeth, p2Teeth, desiredCenter, allowHalfLinks),
    [chain, p1Teeth, p2Teeth, desiredCenter, allowHalfLinks],
  );

  const isSmallerChainSuggested = useMemo(
    () =>
      results.smaller.differenceFromTarget
        .abs()
        .lte(results.larger.differenceFromTarget.abs()),
    [results.smaller.differenceFromTarget, results.larger.differenceFromTarget],
  );

  const serializedState = useSerializedState(DEFAULT_PARAMS, {
    chain,
    p1Teeth,
    p2Teeth,
    desiredCenter,
    extraCenter,
    allowHalfLinks,
  });

  return (
    <div>
      <CalcHeading
        title="链条计算器"
        getSerializedState={() => serializedState}
        copyLabel="复制链接"
        copiedLabel="已复制"
      />

      <div className="flex flex-row flex-wrap gap-x-4 px-1 *:flex-1">
        <div className="flex flex-col gap-x-4 gap-y-2">
          <IOLine>
            <StringSelectInput
              stateHook={[chain, setChain]}
              label="链条类型"
              choices={[
                { label: '#25', value: '#25' },
                { label: '#35', value: '#35' },
              ]}
              testId="chainType"
            />
            <BooleanInput
              stateHook={[allowHalfLinks, setAllowHalfLinks]}
              label="允许半链节"
            />
          </IOLine>

          <IOLine>
            <MeasurementInput
              stateHook={[desiredCenter, setDesiredCenter]}
              label="目标中心距"
              testId="desiredCenter"
            />
            <MeasurementInput
              stateHook={[extraCenter, setExtraCenter]}
              label="额外中心距"
              testId="extraCenter"
            />
          </IOLine>

          <div className="flex flex-col gap-2 md:flex-row">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>链轮 1</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-2">
                <IOLine>
                  <NumberInput
                    stateHook={[p1Teeth, setP1Teeth]}
                    label="齿数"
                    testId="p1Teeth"
                  />
                </IOLine>
                <IOLine>
                  <MeasurementOutput
                    state={p1PitchDiameter}
                    label="节圆直径"
                    defaultUnit="mm"
                    testId="p1PitchDiameter"
                  />
                </IOLine>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle>链轮 2</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-2">
                <IOLine>
                  <NumberInput
                    stateHook={[p2Teeth, setP2Teeth]}
                    label="齿数"
                    testId="p2Teeth"
                  />
                </IOLine>
                <IOLine>
                  <MeasurementOutput
                    state={p2PitchDiameter}
                    label="节圆直径"
                    defaultUnit="mm"
                    testId="p2PitchDiameter"
                  />
                </IOLine>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex min-h-7 items-center gap-2">
                较小链条
                {isSmallerChainSuggested && <SuggestedBadge />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2">
              <IOLine>
                <NumberOutput
                  state={results.smaller.links}
                  label="链节数"
                  roundTo={0}
                  testId="smallerCenter"
                />
                <MeasurementOutput
                  state={results.smaller.distance}
                  label="中心距"
                  defaultUnit="mm"
                  testId="smallerDistance"
                />
              </IOLine>
              <IOLine>
                <MeasurementOutput
                  state={results.smaller.differenceFromTarget}
                  label="与目标差值"
                  defaultUnit="mm"
                  testId="smallerDiffFromTarget"
                />
              </IOLine>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex min-h-7 items-center gap-2">
                较大链条
                {!isSmallerChainSuggested && <SuggestedBadge />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2">
              <IOLine>
                <NumberOutput
                  state={results.larger.links}
                  label="链节数"
                  roundTo={0}
                  testId="largerCenter"
                />
                <MeasurementOutput
                  state={results.larger.distance}
                  label="中心距"
                  defaultUnit="mm"
                  testId="largerDistance"
                />
              </IOLine>
              <IOLine>
                <MeasurementOutput
                  state={results.larger.differenceFromTarget}
                  label="与目标差值"
                  defaultUnit="mm"
                  testId="largerDiffFromTarget"
                />
              </IOLine>
            </CardContent>
          </Card>
        </div>

        <div className="flex w-auto flex-col gap-x-4 gap-y-4">
          <SprocketTable
            filterFn={(sprocket) =>
              sprocket.chainType === chain &&
              (sprocket.teeth === p1Teeth || sprocket.teeth === p2Teeth)
            }
            labels={{
              title: '匹配的 COTS 链轮',
              teeth: '齿数',
              bore: '轴孔',
            }}
          />
        </div>
      </div>
    </div>
  );
}
