package com.smartcity.ecommerce.service;

import com.smartcity.ecommerce.dto.UserDTO;
import com.smartcity.ecommerce.model.Role;
import com.smartcity.ecommerce.model.User;
import com.smartcity.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .phone("555-1234")
                .role(Role.CUSTOMER)
                .blocked(false)
                .build();
    }

    @Test
    void getUserByUsername_existingUser_returnsDTO() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act
        UserDTO dto = userService.getUserByUsername("testuser");

        // Assert
        assertThat(dto.getUsername()).isEqualTo("testuser");
        assertThat(dto.getEmail()).isEqualTo("test@example.com");
        assertThat(dto.getRole()).isEqualTo("CUSTOMER");
        assertThat(dto.isBlocked()).isFalse();
    }

    @Test
    void getUserByUsername_notFound_throwsException() {
        // Arrange
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getUserByUsername("unknown"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void getUserById_existingUser_returnsDTO() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        UserDTO dto = userService.getUserById(1L);

        // Assert
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getUsername()).isEqualTo("testuser");
    }

    @Test
    void getUserById_notFound_throwsException() {
        // Arrange
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getUserById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void updateProfile_validUpdate_returnsUpdatedDTO() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDTO updateDTO = new UserDTO();
        updateDTO.setFullName("Updated Name");
        updateDTO.setPhone("555-9999");

        // Act
        UserDTO result = userService.updateProfile("testuser", updateDTO);

        // Assert
        assertThat(result).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void getAllUsers_returnsListOfDTOs() {
        // Arrange
        User user2 = User.builder()
                .id(2L)
                .username("user2")
                .email("user2@example.com")
                .role(Role.SELLER)
                .blocked(false)
                .build();
        when(userRepository.findAll()).thenReturn(List.of(user, user2));

        // Act
        List<UserDTO> result = userService.getAllUsers();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getUsername()).isEqualTo("testuser");
        assertThat(result.get(1).getUsername()).isEqualTo("user2");
    }

    @Test
    void blockUser_existingUser_setsBlocked() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        userService.blockUser(1L);

        // Assert
        assertThat(user.isBlocked()).isTrue();
        verify(userRepository).save(user);
    }

    @Test
    void unblockUser_existingUser_clearsBlocked() {
        // Arrange
        user.setBlocked(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        userService.unblockUser(1L);

        // Assert
        assertThat(user.isBlocked()).isFalse();
        verify(userRepository).save(user);
    }
}
