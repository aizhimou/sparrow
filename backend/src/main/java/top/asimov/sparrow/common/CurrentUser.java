package top.asimov.sparrow.common;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

  public long id() {
    return StpUtil.getLoginIdAsLong();
  }

  public String idString() {
    return String.valueOf(id());
  }
}
