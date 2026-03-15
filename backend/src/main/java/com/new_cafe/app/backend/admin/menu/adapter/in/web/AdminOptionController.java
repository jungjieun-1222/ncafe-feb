package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import com.new_cafe.app.backend.cart.adapter.out.persistence.entity.MenuOptionEntity;
import com.new_cafe.app.backend.cart.adapter.out.persistence.repository.MenuOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/options")
@RequiredArgsConstructor
public class AdminOptionController {

    private final MenuOptionRepository menuOptionRepository;

    @GetMapping
    public List<MenuOptionEntity> getAllOptions() {
        return menuOptionRepository.findAll();
    }

    @PostMapping
    public MenuOptionEntity createOption(@RequestBody MenuOptionEntity option) {
        return menuOptionRepository.save(option);
    }

    @DeleteMapping("/{id}")
    public void deleteOption(@PathVariable Long id) {
        menuOptionRepository.deleteById(id);
    }
}
