import { useMemo, useState } from 'react';

import IOLine from '~/components/recalc/blocks';
import CalcHeading from '~/components/recalc/calcHeading';
import {
  MeasurementInput,
  MeasurementOutput,
} from '~/components/recalc/io/measurement';
import { MotorInput } from '~/components/recalc/io/motor';
import { NumberOutput } from '~/components/recalc/io/number';
import { RatioInput } from '~/components/recalc/io/ratio';
import { useQueryParams, useSerializedState } from '~/lib/hooks';
import { buildCalculatorApp, buildJsonLd, buildWebPage } from '~/lib/jsonld';
import {
  calculateAllRecommendedRatiosAndStallTorques,
  calculateLinearSurfaceSpeed,
} from '~/lib/math/intake';
import Measurement from '~/lib/models/Measurement';
import Motor from '~/lib/models/Motor';
import Ratio, { RatioType } from '~/lib/models/Ratio';
import { buildMeta, pageUrl } from '~/lib/seo';
import {
  MeasurementParam,
  MotorParam,
  RatioParam,
} from '~/lib/types/queryParams';
import { cn } from '~/lib/utils';

const INTAKE_PATH = '/zh/intake';
const INTAKE_TITLE = 'FRC 与 FTC 拾取机构计算器 | ReCalc';
const INTAKE_NAME = '拾取机构计算器';
const INTAKE_DESCRIPTION =
  '计算 FRC 和 FTC 机器人的拾取滚轮机构，估算表面线速度、电机需求和 game piece 游戏物体输送表现。';

export function meta() {
  return [
    ...buildMeta({
      path: INTAKE_PATH,
      title: INTAKE_TITLE,
      description: INTAKE_DESCRIPTION,
    }),
    {
      'script:ld+json': buildJsonLd(
        buildWebPage({
          url: pageUrl(INTAKE_PATH),
          name: INTAKE_NAME,
          description: INTAKE_DESCRIPTION,
          breadcrumbLabel: INTAKE_NAME,
        }),
        buildCalculatorApp({
          url: pageUrl(INTAKE_PATH),
          name: INTAKE_NAME,
          description: INTAKE_DESCRIPTION,
        }),
      ),
    },
  ];
}

const DEFAULT_PARAMS = {
  motor: MotorParam.withDefault(Motor.KrakenX60sFOC(1)),
  ratio: RatioParam.withDefault(new Ratio(2, RatioType.REDUCTION)),
  rollerDiameter: MeasurementParam.withDefault(new Measurement(2, 'in')),
  travelDistance: MeasurementParam.withDefault(new Measurement(15, 'in')),
  drivetrainSpeed: MeasurementParam.withDefault(new Measurement(14, 'ft/s')),
  statorCurrentLimit: MeasurementParam.withDefault(new Measurement(30, 'A')),
};

export default function ChineseIntake() {
  const queryParams = useQueryParams(DEFAULT_PARAMS);

  const [motor, setMotor] = useState(queryParams.motor);
  const [ratio, setRatio] = useState(queryParams.ratio);
  const [rollerDiameter, setRollerDiameter] = useState(
    queryParams.rollerDiameter,
  );
  const [travelDistance, setTravelDistance] = useState(
    queryParams.travelDistance,
  );
  const [drivetrainSpeed, setDrivetrainSpeed] = useState(
    queryParams.drivetrainSpeed,
  );
  const [statorCurrentLimit, setStatorCurrentLimit] = useState(
    queryParams.statorCurrentLimit,
  );

  const surfaceSpeed = useMemo(
    () => calculateLinearSurfaceSpeed(motor, ratio, rollerDiameter),
    [motor, ratio, rollerDiameter],
  );

  const timeToGoal = useMemo(() => {
    if (surfaceSpeed.scalar === 0) {
      return new Measurement(0, 's');
    }
    return travelDistance.div(surfaceSpeed);
  }, [travelDistance, surfaceSpeed]);

  const allRecommendedRatiosAndStallTorques = useMemo(() => {
    return calculateAllRecommendedRatiosAndStallTorques(
      drivetrainSpeed,
      rollerDiameter,
      motor.quantity,
      statorCurrentLimit,
    );
  }, [drivetrainSpeed, rollerDiameter, motor.quantity, statorCurrentLimit]);

  const serializedState = useSerializedState(DEFAULT_PARAMS, {
    motor,
    ratio,
    rollerDiameter,
    travelDistance,
    drivetrainSpeed,
    statorCurrentLimit,
  });

  return (
    <div>
      <CalcHeading
        title="拾取机构计算器"
        getSerializedState={() => serializedState}
        copyLabel="复制链接"
        copiedLabel="已复制"
      />
      <div className="flex flex-row flex-wrap gap-6 px-1">
        <div className="flex min-w-75 flex-1 flex-col">
          <section className="flex flex-col rounded-lg border">
            {/* Motor & Gearing section */}
            <div className="flex flex-col gap-3 p-4">
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                电机与传动
              </h2>
              <IOLine>
                <MotorInput
                  stateHook={[motor, setMotor]}
                  testId="motor"
                  label="电机"
                  labelAbove
                />
              </IOLine>
              <IOLine>
                <RatioInput
                  stateHook={[ratio, setRatio]}
                  testId="ratio"
                  label="传动比"
                  labelAbove
                />
              </IOLine>
            </div>
            <div className="border-t" />

            {/* Roller section */}
            <div className="flex flex-col gap-3 p-4">
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                滚轮
              </h2>
              <IOLine>
                <MeasurementInput
                  stateHook={[rollerDiameter, setRollerDiameter]}
                  label="滚轮直径"
                  tooltip="带动物体移动的滚轮、轮组或滚筒等的直径。"
                  testId="rollerDiameter"
                  labelAbove
                />
                <MeasurementInput
                  stateHook={[travelDistance, setTravelDistance]}
                  label="输送距离"
                  tooltip="game piece 游戏物体预计通过拾取机构移动的距离。"
                  testId="travelDistance"
                  labelAbove
                />
              </IOLine>
              <IOLine>
                <MeasurementInput
                  stateHook={[statorCurrentLimit, setStatorCurrentLimit]}
                  label="Stator 电流限制"
                  tooltip="stator 定子允许拉取的最大电流。"
                  testId="statorCurrentLimit"
                  labelAbove
                />
              </IOLine>
            </div>
            <div className="border-t" />

            {/* Reverse Calculation section */}
            <div className="flex flex-col gap-3 p-4">
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                反向计算
              </h2>
              <IOLine>
                <MeasurementInput
                  stateHook={[drivetrainSpeed, setDrivetrainSpeed]}
                  label="底盘速度"
                  tooltip="drivetrain 底盘的地面速度。"
                  testId="drivetrainSpeed"
                  labelAbove
                />
              </IOLine>
            </div>
            <div className="border-t" />

            {/* Recommended Ratios section */}
            <div className="flex flex-col gap-3 p-4">
              <div>
                <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  每个电机的建议传动比
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  建议传动比表示滚轮表面速度约为 drivetrain
                  底盘速度两倍时的传动比。
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                {allRecommendedRatiosAndStallTorques
                  .sort((a, b) => b.stallTorque.sub(a.stallTorque).baseScalar)
                  .map((rts) => (
                    <IOLine
                      key={rts.motor.identifier}
                      className={cn({
                        'rounded-md border border-green-400 px-2 py-2':
                          rts.motor.eq(motor),
                      })}
                    >
                      <NumberOutput
                        state={rts.ratio.asNumber()}
                        label={`${rts.motor.identifier}`}
                        roundTo={2}
                        testId={`${rts.motor.identifier}-ratio`}
                      />
                      <MeasurementOutput
                        state={rts.stallTorque}
                        label="Stall Torque 堵转扭矩"
                        tooltip="电机在建议传动比下的 stall torque 堵转扭矩。"
                        defaultUnit="N*m"
                        roundTo={2}
                        testId={`${rts.motor.identifier}-stallTorque`}
                      />
                    </IOLine>
                  ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex min-w-75 flex-1 flex-col gap-y-2">
          <IOLine>
            <MeasurementOutput
              state={surfaceSpeed}
              label="线速度"
              tooltip="带动 game piece 游戏物体移动的滚轮表面速度。"
              defaultUnit="ft/s"
              roundTo={1}
              testId="surfaceSpeed"
            />
          </IOLine>

          <IOLine>
            <MeasurementOutput
              state={timeToGoal}
              label="到达目标时间"
              tooltip="game piece 游戏物体移动指定距离所需的时间。"
              defaultUnit="s"
              roundTo={2}
              testId="timeToGoal"
            />
          </IOLine>
        </div>
      </div>
    </div>
  );
}
