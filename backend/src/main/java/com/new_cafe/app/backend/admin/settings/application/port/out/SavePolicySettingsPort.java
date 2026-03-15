package com.new_cafe.app.backend.admin.settings.application.port.out;

import com.new_cafe.app.backend.admin.settings.domain.PolicySettings;

public interface SavePolicySettingsPort {
    void savePolicySettings(PolicySettings settings);
}
