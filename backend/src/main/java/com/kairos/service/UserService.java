package com.kairos.service;

import com.kairos.dto.response.UserDashboardResponse;
import com.kairos.dto.response.UserResponse;
import com.kairos.entity.User;

public interface UserService {

    UserDashboardResponse getUserDashboard(User user);

    UserResponse updateUserProfile(User user, String name, String phone, String avatarUrl);
}
