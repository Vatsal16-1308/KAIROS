package com.kairos.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRoleRequest {

    @NotBlank(message = "Role is required")
    private String role; // "USER", "ORGANIZER", "ADMIN"
}
