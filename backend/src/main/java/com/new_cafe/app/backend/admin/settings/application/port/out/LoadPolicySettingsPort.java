package com.new_cafe.app.backend.admin.settings.application.port.out;

import com.new_cafe.app.backend.admin.settings.domain.PolicySettings;
import java.util.Optional;

public interface LoadPolicySettingsPort {
    Optional<PolicySettings> loadPolicySettings();
}
