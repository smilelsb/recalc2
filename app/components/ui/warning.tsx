import { useLocation } from 'react-router';
import AlertTriangleIcon from '~icons/lucide/triangle-alert';

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { cn } from '~/lib/utils';

function Warning() {
  const { pathname } = useLocation();
  const isZh = pathname === '/zh' || pathname.startsWith('/zh/');

  return (
    <Alert
      className={cn(
        `mx-auto w-full border-yellow-200 bg-yellow-50 text-yellow-900 md:w-1/3 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100`,
      )}
    >
      <AlertTriangleIcon />
      <AlertTitle className="text-yellow-900 dark:text-yellow-100">
        {isZh ? '警告' : 'Warning'}
      </AlertTitle>
      <AlertDescription className="text-yellow-800 *:contents dark:text-yellow-200">
        {isZh ? (
          <>
            这些计算器<b>仅供参考</b>。结果是用于帮助你选择更合适方案的估算值，
            不应被视为绝对准确的结论。我无法保证所有场景下的数学结果都完全准确。
          </>
        ) : (
          <>
            These calculators are provided as reference&nbsp;<b>only</b>. These
            should not be taken as the holy truth of the universe - they are
            estimates created in order to guide you to the best solution. I
            cannot guarantee the math is perfectly accurate in all scenarios.
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}

export { Warning };
