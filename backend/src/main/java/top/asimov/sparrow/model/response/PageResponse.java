package top.asimov.sparrow.model.response;

import java.util.List;

public record PageResponse<T>(
    List<T> records,
    long page,
    long size,
    long total) {
}
