package com.websecurity.websecurity.vm;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VirtualMachineRepository extends JpaRepository<VirtualMachine, Long> {
    List<VirtualMachine> findByUsuarioUsername(String username);
}