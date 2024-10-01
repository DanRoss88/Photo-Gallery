import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useForm } from "../../Hooks/useForm";
import { Snackbar } from "../Photo/Snackbar";
import { FormField } from "./FormField";
import { apiClientInstance } from "../../Services/api";
import { RegisterFormValues } from "../../types";
import { formContainerStyles, formPaperStyles, formStyles } from "../../theme";
import { AuthResponse, AlertColor } from "../../types";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleRegister = async (values: RegisterFormValues) => {
    try {
        const response = await apiClientInstance.post<AuthResponse>('/users/register', values);
        localStorage.setItem('token', response.token);
      setSnackbar({
        open: true,
        message: "Registration successful!",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Registration failed. Please try again.",
        severity: "error",
      });
    }
  };

  const { values, handleChange, handleSubmit, isLoading } =
    useForm<RegisterFormValues>({
      initialValues: { username: "", email: "", password: "" },
      onSubmit: handleRegister,
    });

  return (
    <Box sx={formContainerStyles}>
      <Paper elevation={3} sx={formPaperStyles}>
        <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PersonAddOutlinedIcon
              sx={{ fontSize: 40, mb: 1 }}
              color="primary"
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Register
            </Typography>
          </Box>
          <FormField
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            required
          />
          <FormField
            type="email"
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
          />
          <FormField
            type="password"
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default Register;
