package com.websecurity.websecurity.vm;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VirtualMachineService {

    @Autowired
    private VirtualMachineRepository vmRepository;

    @Autowired
    private UserRepository userRepository;

    public List<VirtualMachine> findAll() {
        return vmRepository.findAll();
    }

    public Optional<VirtualMachine> findById(Long id) {
        return vmRepository.findById(id);
    }

    public VirtualMachine save(VirtualMachine vm, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        vm.setUsuario(user);
        vm.setFechaAñadida(new java.util.Date());
        return vmRepository.save(vm);
    }

    public VirtualMachine update(Long id, VirtualMachine updatedVm, String username) {
        VirtualMachine vm = vmRepository.findById(id).orElseThrow();
        if (!vm.getUsuario().getUsername().equals(username)) {
            throw new SecurityException("No autorizado");
        }
        vm.setNombre(updatedVm.getNombre());
        vm.setDescripcion(updatedVm.getDescripcion());
        vm.setEnlaceDescarga(updatedVm.getEnlaceDescarga());
        return vmRepository.save(vm);
    }

    public void delete(Long id, User user) {
        VirtualMachine vm = vmRepository.findById(id).orElseThrow();
        boolean isOwner = vm.getUsuario().getId().equals(user.getId());
        boolean isAdminOrMod = user.getRol() == User.Rol.ADMIN || user.getRol() == User.Rol.MODERATOR;
        if (!isOwner && !isAdminOrMod) {
            throw new SecurityException("No autorizado");
        }
        vmRepository.delete(vm);
    }
}