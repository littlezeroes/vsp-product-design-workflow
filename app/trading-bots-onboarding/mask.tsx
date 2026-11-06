/* eslint-disable @typescript-eslint/no-explicit-any */
import {View} from './native';
export default function MaskedView({style,children}:any){return <View style={[style,{maskImage:'linear-gradient(#fff 0%,#fff 74%,transparent 97%)'}]}>{children}</View>}
