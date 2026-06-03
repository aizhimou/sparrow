package top.asimov.sparrow.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import top.asimov.sparrow.model.entity.Project;

@SpringBootTest
class ProjectMapperTest {

  @Autowired
  private ProjectMapper projectMapper;

  @Test
  void mapperXmlLoadsAndReturnsSeededProjects() {
    Page<Project> page = projectMapper.selectPageByUserId(
        new Page<>(1, 10), 1800000000000000001L);

    assertThat(page.getRecords()).hasSize(2);
    assertThat(String.valueOf(page.getRecords().getFirst().getId()))
        .startsWith("180000000000000");
  }
}
