package com.new_cafe.app.backend.admin.settings.application.port.out;

import com.new_cafe.app.backend.admin.settings.domain.StoreSettings;

public interface SaveStoreSettingsPort {
    void saveStoreSettings(StoreSettings settings);
}
