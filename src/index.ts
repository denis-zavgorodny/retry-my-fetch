import getWidget from './index';

function getWidgetFn<getWidget>(n: number):string {
  return `${n}`;
}

let res: string = getWidgetFn(1);
alert(res);

export default getWidgetFn;




