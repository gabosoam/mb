import IconWithBadge from "./iconWithBadge";
import React from 'react';


const HomeIconWithBadge = (props) => {
  // You should pass down the badgeCount in some other ways like react context api, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
}
export default HomeIconWithBadge