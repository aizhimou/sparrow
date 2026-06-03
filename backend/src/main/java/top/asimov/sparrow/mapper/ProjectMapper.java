package top.asimov.sparrow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;
import top.asimov.sparrow.model.entity.Project;

public interface ProjectMapper extends BaseMapper<Project> {

  Page<Project> selectPageByUserId(Page<Project> page, @Param("userId") long userId);

  Project selectOwnedById(@Param("id") long id, @Param("userId") long userId);
}
