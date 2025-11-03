import { Icons } from '../components/assets/index';

declare global {
 type IconName = keyof typeof Icons;

 type StyleProps = { [key: string]: any };

 interface SVGProps {
  [key: string]: any;
  className?: string;
  style?: StyleProps;
 }
}

export {};
