import { Link, useLocation } from 'react-router';
import CarbonTimingBelt from '~icons/carbon/timing-belt';
import EmojioneMonotoneChains from '~icons/emojione-monotone/chains';
import Fa7SolidGears from '~icons/fa7-solid/gears';
import Disc3Icon from '~icons/lucide/disc-3';
import Home from '~icons/lucide/home';
import InfoIcon from '~icons/lucide/info';
import MoveVerticalIcon from '~icons/lucide/move-vertical';
import RatioIcon from '~icons/lucide/ratio';
import RotateCwIcon from '~icons/lucide/rotate-cw';
import SearchIcon from '~icons/lucide/search';
import ZapIcon from '~icons/lucide/zap';
import StreamlineUltimateFactoryIndustrialRobotArm1 from '~icons/streamline-ultimate/factory-industrial-robot-arm-1';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';

interface SidebarLink {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const calculatorLinks: SidebarLink[] = [
  { title: 'Belt Calculator', url: '/belts', icon: CarbonTimingBelt },
  { title: 'Chain Calculator', url: '/chains', icon: EmojioneMonotoneChains },
  {
    title: 'Linear Mechanism Calculator',
    url: '/linear',
    icon: MoveVerticalIcon,
  },
  {
    title: 'Arm Calculator',
    url: '/arm',
    icon: StreamlineUltimateFactoryIndustrialRobotArm1,
  },
  { title: 'Flywheel Calculator', url: '/flywheel', icon: Disc3Icon },
  {
    title: 'Ratio Finder',
    url: '/ratio-finder',
    icon: SearchIcon,
  },
  {
    title: 'Ratio Calculator',
    url: '/ratio',
    icon: RatioIcon,
  },
  { title: 'Gears Calculator', url: '/gears', icon: Fa7SolidGears },
  { title: 'Intake Calculator', url: '/intake', icon: RotateCwIcon },
];

const informationLinks: SidebarLink[] = [
  { title: 'Motors', url: '/motors', icon: ZapIcon },
  { title: 'About', url: '/about', icon: InfoIcon },
];

const zhCalculatorLinks: SidebarLink[] = [
  { title: '同步带计算器', url: '/zh/belts', icon: CarbonTimingBelt },
  { title: '链条计算器', url: '/zh/chains', icon: EmojioneMonotoneChains },
  {
    title: '直线机构计算器',
    url: '/zh/linear',
    icon: MoveVerticalIcon,
  },
  {
    title: '机械臂计算器（英文）',
    url: '/arm',
    icon: StreamlineUltimateFactoryIndustrialRobotArm1,
  },
  { title: '飞轮计算器（英文）', url: '/flywheel', icon: Disc3Icon },
  {
    title: '传动比查找器（英文）',
    url: '/ratio-finder',
    icon: SearchIcon,
  },
  {
    title: '传动比计算器（英文）',
    url: '/ratio',
    icon: RatioIcon,
  },
  { title: '齿轮计算器（英文）', url: '/gears', icon: Fa7SolidGears },
  { title: '拾取机构计算器（英文）', url: '/intake', icon: RotateCwIcon },
];

const zhInformationLinks: SidebarLink[] = [
  { title: '电机参数（英文）', url: '/motors', icon: ZapIcon },
  { title: '关于 ReCalc（英文）', url: '/about', icon: InfoIcon },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isZh = currentPath === '/zh' || currentPath.startsWith('/zh/');
  const homeUrl = isZh ? '/zh' : '/';
  const homeTitle = isZh ? '首页' : 'Home';
  const calculatorGroupLabel = isZh ? '计算器' : 'Calculators';
  const informationGroupLabel = isZh ? '信息' : 'Information';
  const activeCalculatorLinks = isZh ? zhCalculatorLinks : calculatorLinks;
  const activeInformationLinks = isZh ? zhInformationLinks : informationLinks;

  function isActive(url: string) {
    if (url === '/' || url === '/zh') {
      return currentPath === url;
    }
    return currentPath.startsWith(url);
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive(homeUrl)}
              render={
                <Link to={homeUrl}>
                  <Home className="size-4" />
                  <span>{homeTitle}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{calculatorGroupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeCalculatorLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.url}>
                    <SidebarMenuButton
                      isActive={isActive(link.url)}
                      tooltip={link.title}
                      render={
                        <Link to={link.url}>
                          <Icon className="size-4" />
                          <span>{link.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{informationGroupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeInformationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.url}>
                    <SidebarMenuButton
                      isActive={isActive(link.url)}
                      tooltip={link.title}
                      render={
                        <Link to={link.url}>
                          <Icon className="size-4" />
                          <span>{link.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
