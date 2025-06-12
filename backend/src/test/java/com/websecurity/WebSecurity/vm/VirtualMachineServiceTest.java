package com.websecurity.WebSecurity.vm;

import com.websecurity.websecurity.vm.VirtualMachine;
import com.websecurity.websecurity.vm.VirtualMachineRepository;
import com.websecurity.websecurity.vm.VirtualMachineService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class VirtualMachineServiceTest {

    private VirtualMachineRepository vmRepository;
    private UserRepository userRepository;
    private VirtualMachineService vmService;

    @BeforeEach
    void setUp() {
        vmRepository = mock(VirtualMachineRepository.class);
        userRepository = mock(UserRepository.class);
        vmService = new VirtualMachineService();

        // Inyecta los mocks manualmente
        try {
            var fieldVm = VirtualMachineService.class.getDeclaredField("vmRepository");
            fieldVm.setAccessible(true);
            fieldVm.set(vmService, vmRepository);

            var fieldUser = VirtualMachineService.class.getDeclaredField("userRepository");
            fieldUser.setAccessible(true);
            fieldUser.set(vmService, userRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        VirtualMachine vm = new VirtualMachine();
        when(vmRepository.findAll()).thenReturn(Collections.singletonList(vm));
        List<VirtualMachine> result = vmService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        VirtualMachine vm = new VirtualMachine();
        vm.setId(1L);
        when(vmRepository.findById(1L)).thenReturn(Optional.of(vm));
        Optional<VirtualMachine> found = vmService.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testSave() {
        User user = new User();
        user.setUsername("raul");
        VirtualMachine vm = new VirtualMachine();
        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(vmRepository.save(any(VirtualMachine.class))).thenAnswer(inv -> inv.getArgument(0));

        VirtualMachine saved = vmService.save(vm, "raul");
        assertEquals(user, saved.getUsuario());
        assertNotNull(saved.getFechaAñadida());
    }

    @Test
    void testUpdate_Success() {
        User user = new User();
        user.setUsername("raul");
        VirtualMachine vm = new VirtualMachine();
        vm.setId(2L);
        vm.setUsuario(user);

        VirtualMachine updatedVm = new VirtualMachine();
        updatedVm.setNombre("Nueva VM");
        updatedVm.setDescripcion("Desc");
        updatedVm.setEnlaceDescarga("link");

        when(vmRepository.findById(2L)).thenReturn(Optional.of(vm));
        when(vmRepository.save(any(VirtualMachine.class))).thenReturn(vm);

        VirtualMachine result = vmService.update(2L, updatedVm, "raul");
        assertEquals("Nueva VM", result.getNombre());
        assertEquals("Desc", result.getDescripcion());
        assertEquals("link", result.getEnlaceDescarga());
    }

    @Test
    void testUpdate_NotOwner() {
        User user = new User();
        user.setUsername("raul");
        VirtualMachine vm = new VirtualMachine();
        vm.setId(3L);
        User otro = new User();
        otro.setUsername("otro");
        vm.setUsuario(otro);

        when(vmRepository.findById(3L)).thenReturn(Optional.of(vm));

        VirtualMachine updatedVm = new VirtualMachine();
        assertThrows(SecurityException.class, () -> vmService.update(3L, updatedVm, "raul"));
    }

    @Test
    void testDelete_Owner() {
        User user = new User();
        user.setId(1L);
        user.setRol(User.Rol.USER);
        VirtualMachine vm = new VirtualMachine();
        vm.setId(4L);
        vm.setUsuario(user);

        when(vmRepository.findById(4L)).thenReturn(Optional.of(vm));

        assertDoesNotThrow(() -> vmService.delete(4L, user));
        verify(vmRepository, times(1)).delete(vm);
    }

    @Test
    void testDelete_Admin() {
        User user = new User();
        user.setId(2L);
        user.setRol(User.Rol.ROLE_ADMIN);
        VirtualMachine vm = new VirtualMachine();
        vm.setId(5L);
        User owner = new User();
        owner.setId(3L);
        vm.setUsuario(owner);

        when(vmRepository.findById(5L)).thenReturn(Optional.of(vm));

        assertDoesNotThrow(() -> vmService.delete(5L, user));
        verify(vmRepository, times(1)).delete(vm);
    }

    @Test
    void testDelete_NotAllowed() {
        User user = new User();
        user.setId(2L);
        user.setRol(User.Rol.USER);
        VirtualMachine vm = new VirtualMachine();
        vm.setId(6L);
        User owner = new User();
        owner.setId(3L);
        vm.setUsuario(owner);

        when(vmRepository.findById(6L)).thenReturn(Optional.of(vm));

        assertThrows(SecurityException.class, () -> vmService.delete(6L, user));
        verify(vmRepository, never()).delete(any());
    }
}