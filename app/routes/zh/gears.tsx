import { useMemo, useState } from 'react';
import TriangleAlertIcon from '~icons/lucide/triangle-alert';

import CalcHeading from '~/components/recalc/calcHeading';
import { GearTable } from '~/components/recalc/gearTable';
import { MeasurementDisplayOutput } from '~/components/recalc/io/measurement';
import NumberInput from '~/components/recalc/io/number';
import { useQueryParams, useSerializedState } from '~/lib/hooks';
import { buildCalculatorApp, buildJsonLd, buildWebPage } from '~/lib/jsonld';
import { calculateSpacing } from '~/lib/math/gears';
import { buildMeta, pageUrl } from '~/lib/seo';
import { NumberParam } from '~/lib/types/queryParams';

const GEARS_PATH = '/zh/gears';
const GEARS_TITLE = 'FRC 与 FTC 齿轮计算器 | ReCalc';
const GEARS_NAME = '齿轮计算器';
const GEARS_DESCRIPTION =
  '计算 FRC 和 FTC 机器人齿轮传动配置，估算传动比、中心距和齿轮啮合匹配情况。';

export function meta() {
  return [
    ...buildMeta({
      path: GEARS_PATH,
      title: GEARS_TITLE,
      description: GEARS_DESCRIPTION,
    }),
    {
      'script:ld+json': buildJsonLd(
        buildWebPage({
          url: pageUrl(GEARS_PATH),
          name: GEARS_NAME,
          description: GEARS_DESCRIPTION,
          breadcrumbLabel: GEARS_NAME,
        }),
        buildCalculatorApp({
          url: pageUrl(GEARS_PATH),
          name: GEARS_NAME,
          description: GEARS_DESCRIPTION,
        }),
      ),
    },
  ];
}

const DEFAULT_PARAMS = {
  gear1Teeth: NumberParam.withDefault(16),
  gear2Teeth: NumberParam.withDefault(36),
  gearDP: NumberParam.withDefault(20),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export default function ChineseGears() {
  const queryParams = useQueryParams(DEFAULT_PARAMS);

  const [gear1Teeth, setGear1Teeth] = useState(queryParams.gear1Teeth);
  const [gear2Teeth, setGear2Teeth] = useState(queryParams.gear2Teeth);
  const [gearDP, setGearDP] = useState(queryParams.gearDP);

  const spacing = useMemo(
    () => calculateSpacing(gear1Teeth, gear2Teeth, gearDP),
    [gear1Teeth, gear2Teeth, gearDP],
  );

  const serializedState = useSerializedState(DEFAULT_PARAMS, {
    gear1Teeth,
    gear2Teeth,
    gearDP,
  });

  return (
    <div>
      <CalcHeading
        title="齿轮计算器"
        getSerializedState={() => serializedState}
        copyLabel="复制链接"
        copiedLabel="已复制"
      />
      <div className="flex flex-row flex-wrap gap-x-6 gap-y-6 px-1 *:flex-1">
        {/* Left column: configuration + results */}
        <div className="flex min-w-0 flex-col gap-y-4">
          {/* Parameters */}
          <div className="rounded-xl border bg-muted/20 p-4 shadow-sm">
            <div className="mb-3">
              <SectionLabel>参数</SectionLabel>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-3 *:flex-1 md:flex-nowrap">
                <NumberInput
                  stateHook={[gear1Teeth, setGear1Teeth]}
                  label="齿轮 1 齿数"
                  testId="gear1Teeth"
                  labelAbove
                />
                <NumberInput
                  stateHook={[gear2Teeth, setGear2Teeth]}
                  label="齿轮 2 齿数"
                  testId="gear2Teeth"
                  labelAbove
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-3 *:flex-1 md:flex-nowrap">
                <NumberInput
                  stateHook={[gearDP, setGearDP]}
                  label="Gear DP"
                  testId="gearDP"
                  labelAbove
                />
              </div>
            </div>
          </div>

          <MeasurementDisplayOutput
            state={spacing}
            label="中心距"
            defaultUnit="in"
            testId="spacing"
          />

          {/* Warning */}
          <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-muted-foreground">
            <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <p>
              许多较小齿轮的 pitch diameter 节圆直径并不等同于它们的齿数。{' '}
              <span className="font-medium text-foreground">
                此计算器不会自动修正这种差异。
              </span>{' '}
              例如，{' '}
              <a
                href="https://wcproducts.com/products/wcp-1720"
                className="underline underline-offset-4 hover:text-foreground"
              >
                WCP-1720
              </a>{' '}
              是 16t 齿轮，但中心距相当于 18t；在此计算器中应使用 18t。
            </p>
          </div>
        </div>

        {/* Right column: COTS table */}
        <div className="flex w-auto flex-col gap-y-4">
          <GearTable
            filterFn={(gear) =>
              (gear.teeth === gear1Teeth || gear.teeth === gear2Teeth) &&
              gear.dp === gearDP
            }
            labels={{
              title: '匹配的 COTS 齿轮',
              teeth: '齿数',
              bore: '孔径',
              noMatchingGears: '没有找到匹配的齿轮',
            }}
          />
        </div>
      </div>
    </div>
  );
}
