package com.new_cafe.app.backend.admin.settings.application.port.in;

import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;
import com.new_cafe.app.backend.admin.settings.domain.PolicySettings;

public interface UpdateSettingsUseCase {
    void updateStoreSettings(StoreSettings settings);
    void updatePolicySettings(PolicySettings settings);
}
