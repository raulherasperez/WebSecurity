package com.websecurity.WebSecurity.vm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.vm.VirtualMachine;
import com.websecurity.websecurity.vm.VirtualMachineService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.vm.VirtualMachineController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;



import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.doThrow;

@WebMvcTest(VirtualMachineController.class)
@AutoConfigureMockMvc(addFilters = false)
public class VirtualMachineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VirtualMachineService vmService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private LogroService logroService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private com.websecurity.websecurity.user.UserRepository userRepository;


    private User user() {
        User u = new User();
        u.setUsername("raul");
        u.setId(1L);
        u.setRol(User.Rol.USER);
        return u;
    }

    private User adminUser() {
        User u = new User();
        u.setUsername("admin");
        u.setId(2L);
        u.setRol(User.Rol.ROLE_ADMIN);
        return u;
    }

    @Test
    void testGetAll() throws Exception {
        VirtualMachine vm = new VirtualMachine();
        vm.setId(1L);
        when(vmService.findAll()).thenReturn(Collections.singletonList(vm));
        mockMvc.perform(get("/api/vms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testGetById_Found() throws Exception {
        VirtualMachine vm = new VirtualMachine();
        vm.setId(2L);
        when(vmService.findById(2L)).thenReturn(Optional.of(vm));
        mockMvc.perform(get("/api/vms/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(vmService.findById(3L)).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/vms/3"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateVM() throws Exception {
        VirtualMachine vm = new VirtualMachine();
        vm.setId(4L);
        Logro logro = new Logro();
        logro.setNombre("¿Cómo estan los máquinas?");

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(vmService.save(any(VirtualMachine.class), eq("raul"))).thenReturn(vm);
        when(logroService.desbloquearLogro("raul", "¿Cómo estan los máquinas?")).thenReturn(logro);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(vm);

        mockMvc.perform(post("/api/vms")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vm.id").value(4L))
                .andExpect(jsonPath("$.logroDesbloqueado.nombre").value("¿Cómo estan los máquinas?"));
    }

    @Test
    void testCreateVM_SinLogro() throws Exception {
        VirtualMachine vm = new VirtualMachine();
        vm.setId(5L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(vmService.save(any(VirtualMachine.class), eq("raul"))).thenReturn(vm);
        when(logroService.desbloquearLogro("raul", "¿Cómo estan los máquinas?")).thenReturn(null);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(vm);

        mockMvc.perform(post("/api/vms")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vm.id").value(5L))
                .andExpect(jsonPath("$.logroDesbloqueado").doesNotExist());
    }

    @Test
    void testUpdateVM_Success() throws Exception {
        VirtualMachine vm = new VirtualMachine();
        vm.setId(6L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(vmService.update(eq(6L), any(VirtualMachine.class), eq("raul"))).thenReturn(vm);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(vm);

        mockMvc.perform(put("/api/vms/6")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(6L));
    }

    @Test
    void testUpdateVM_NotOwner() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(vmService.update(eq(7L), any(VirtualMachine.class), eq("raul"))).thenThrow(new SecurityException("No autorizado"));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(new VirtualMachine());

        mockMvc.perform(put("/api/vms/7")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testDeleteVM_Owner() throws Exception {
        User user = user();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(user));

        mockMvc.perform(delete("/api/vms/8")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteVM_Admin() throws Exception {
        User admin = adminUser();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(admin));

        mockMvc.perform(delete("/api/vms/9")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteVM_NotAllowed() throws Exception {
        User user = user();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(user));
        doThrow(new SecurityException("No autorizado")).when(vmService).delete(eq(10L), eq(user));

        mockMvc.perform(delete("/api/vms/10")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}