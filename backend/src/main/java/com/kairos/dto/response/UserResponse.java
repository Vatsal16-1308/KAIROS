package com.kairos.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String organizationName;
    private String phone;
    private String avatarUrl;
    private Boolean active;
    private LocalDateTime createdAt;
}
