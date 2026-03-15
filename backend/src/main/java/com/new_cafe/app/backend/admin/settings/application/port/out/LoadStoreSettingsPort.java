package com.new_cafe.app.backend.admin.settings.application.port.out;

import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;
import java.util.Optional;

public interface LoadStoreSettingsPort {
    Optional<StoreSettings> loadStoreSettings();
}
