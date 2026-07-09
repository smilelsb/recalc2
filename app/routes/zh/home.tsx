import { type ReactNode } from 'react';
import { Link } from 'react-router';
import CarbonTimingBelt from '~icons/carbon/timing-belt';
import EmojioneMonotoneChains from '~icons/emojione-monotone/chains';
import Fa7SolidGears from '~icons/fa7-solid/gears';
import ArrowRight from '~icons/lucide/arrow-right';
import ArrowUpRight from '~icons/lucide/arrow-up-right';
import Disc3Icon from '~icons/lucide/disc-3';
import InfoIcon from '~icons/lucide/info';
import MoveVerticalIcon from '~icons/lucide/move-vertical';
import RatioIcon from '~icons/lucide/ratio';
import RotateCwIcon from '~icons/lucide/rotate-cw';
import SearchIcon from '~icons/lucide/search';
import ZapIcon from '~icons/lucide/zap';
import StreamlineUltimateFactoryIndustrialRobotArm1 from '~icons/streamline-ultimate/factory-industrial-robot-arm-1';

import { buildJsonLd, buildWebPage, buildWebSite } from '~/lib/jsonld';
import { buildMeta, pageUrl } from '~/lib/seo';
import { cn } from '~/lib/utils';

const TITLE = 'ReCalc 中文版 - FRC 与 FTC 机器人机械设计计算器';
const DESCRIPTION =
  'ReCalc 中文版提供面向 FRC 和 FTC 的机械设计计算器，用于估算同步带、链条、齿轮、机械臂、飞轮和直线机构等机器人机制。';

export function meta() {
  return [
    ...buildMeta({ path: '/zh', title: TITLE, description: DESCRIPTION }),
    {
      'script:ld+json': buildJsonLd(
        buildWebSite(),
        buildWebPage({
          url: pageUrl('/zh'),
          name: 'ReCalc 中文版',
          description: DESCRIPTION,
        }),
      ),
    },
  ];
}

function Hero() {
  return (
    <div className="relative overflow-hidden px-4 pt-12 pb-12 text-center md:pt-12 md:pb-12">
      <div
        className="absolute inset-0 opacity-[0.045] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 -top-16 h-96"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 0%, rgb(0 110 182 / 0.1), transparent)',
        }}
      />
      <div className="relative">
        <h1 className="mb-5 text-6xl font-bold tracking-tight text-foreground md:text-8xl">
          ReCalc
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground md:text-lg">
          面向 FRC 和 FTC
          的机械设计计算器，帮助队伍快速估算传动、机构和电机配置。
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex items-center gap-3', className)}>
      <span className="text-xs font-semibold tracking-widest text-primary uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function CalcCard({
  to,
  title,
  note,
  icon: Icon,
  className,
}: {
  to: string;
  title: string;
  note?: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <Link to={to} className="group block">
      <div
        className={cn(
          'relative flex h-full items-center gap-3 rounded-xl border bg-card p-5 shadow-sm',
          'transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
          className,
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>
          {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}

function InfoCard({
  to,
  title,
  icon: Icon,
}: {
  to: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link to={to} className="group block">
      <div className="flex items-center gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors duration-200 group-hover:bg-primary/10">
          <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
        </div>
        <p className="flex-1 font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
          {title}
        </p>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}

function Shortcut({ name, url }: { name: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm shadow-sm transition-all duration-150 hover:border-primary/40 hover:bg-accent"
    >
      <span className="text-foreground transition-colors duration-150 group-hover:text-primary">
        {name}
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-all duration-150 group-hover:text-primary" />
    </a>
  );
}

function ShortcutGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-3">{children}</div>
    </div>
  );
}

export default function ChineseHome() {
  const year = new Date().getFullYear();
  return (
    <div className="pb-16">
      <Hero />
      <div className="space-y-14 px-2 md:px-0">
        <section>
          <SectionHeader label="计算器" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CalcCard
              to="/zh/belts"
              title="同步带计算器"
              note="已提供中文界面"
              icon={CarbonTimingBelt}
            />
            <CalcCard
              to="/zh/chains"
              title="链条计算器"
              note="已提供中文界面"
              icon={EmojioneMonotoneChains}
            />
            <CalcCard
              to="/gears"
              title="齿轮计算器"
              note="英文页面"
              icon={Fa7SolidGears}
            />
            <CalcCard
              to="/zh/linear"
              title="直线机构计算器"
              note="已提供中文界面"
              icon={MoveVerticalIcon}
            />
            <CalcCard
              to="/flywheel"
              title="飞轮计算器"
              note="英文页面"
              icon={Disc3Icon}
            />
            <CalcCard
              to="/zh/arm"
              title="机械臂计算器"
              note="已提供中文界面"
              icon={StreamlineUltimateFactoryIndustrialRobotArm1}
            />
            <CalcCard
              to="/intake"
              title="拾取机构计算器"
              note="英文页面"
              icon={RotateCwIcon}
            />
            <CalcCard
              to="/ratio-finder"
              title="传动比查找器"
              note="英文页面"
              icon={SearchIcon}
            />
            <CalcCard
              to="/ratio"
              title="传动比计算器"
              note="英文页面"
              icon={RatioIcon}
            />
          </div>
        </section>

        <section>
          <SectionHeader label="信息" />
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              to="/motors"
              title="电机参数（英文页面）"
              icon={ZapIcon}
            />
            <InfoCard
              to="/about"
              title="关于 ReCalc（英文页面）"
              icon={InfoIcon}
            />
          </div>
        </section>

        <section>
          <SectionHeader label="快捷资源" />
          <div className="space-y-6">
            <ShortcutGroup label={`${year} 规则与手册`}>
              <Shortcut
                name={`${year} 官方 PDF 手册`}
                url={`https://firstfrc.blob.core.windows.net/frc${year}/Manual/${year}GameManual.pdf`}
              />
              <Shortcut
                name={`${year} 非官方网页手册`}
                url={`https://www.frcmanual.com/${year}/introduction`}
              />
              <Shortcut
                name={`${year} Q&A`}
                url="https://frc-qa.firstinspires.org/"
              />
            </ShortcutGroup>

            <ShortcutGroup label={`${year} 赛事与队伍`}>
              <Shortcut
                name="队伍 / 赛事搜索"
                url={`https://www.firstinspires.org/team-event-search#type=teams&sort=name&programs=FRC&year=${year}`}
              />
              <Shortcut
                name="FRC-Events"
                url={`https://frc-events.firstinspires.org/${year}/Events/EventList`}
              />
              <Shortcut
                name="TheBlueAlliance"
                url={`https://www.thebluealliance.com/events/${year}`}
              />
            </ShortcutGroup>

            <ShortcutGroup label="社区与资源">
              <Shortcut name="frc.sh" url="https://frc.sh" />
              <Shortcut
                name="FRC 技术资源"
                url="https://www.firstinspires.org/resource-library/frc/technical-resources"
              />
              <Shortcut
                name="Open Alliance"
                url="https://www.chiefdelphi.com/c/first/open-alliance/89"
              />
            </ShortcutGroup>
          </div>
        </section>
      </div>
    </div>
  );
}
