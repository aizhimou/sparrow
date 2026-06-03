package top.asimov.sparrow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import top.asimov.sparrow.model.entity.User;

public interface UserMapper extends BaseMapper<User> {

  User selectByEmail(@Param("email") String email);
}
