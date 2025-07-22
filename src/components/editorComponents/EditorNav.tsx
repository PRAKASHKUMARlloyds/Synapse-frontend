import React from 'react';
import type { FC } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type {SelectChangeEvent} from '@mui/material/Select';
import Container from '@mui/material/Container';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import './CSS/editornav.css';

interface EditorNavProps {
  code: string;
  tech: string;
  theme: string;
  changeTech: (value: string) => void;
  changeTheme: (value: string) => void;
  execute: (code: string) => void;
  onSubmit: () => void;
}

const EditorNav: FC<EditorNavProps> = ({
  code,
  tech,
  theme,
  changeTech,
  changeTheme,
  execute,
  onSubmit
}) => {
  const handleCodeSubmit = () => {
    console.log('Submitting code:', code);
    onSubmit();
  };

  const handleSelectChange = (event: SelectChangeEvent): void => {
    changeTech(event.target.value);
  };

  return (
    <AppBar className="editornav" position="static" sx={{ bgcolor: '#FFFFFF' }}>
      <Toolbar>
        <Container maxWidth={false}>
          <div className="float-left">
            <FormControl variant="outlined" size="small">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tech}
                onChange={handleSelectChange}
                sx={{ fontSize: '16px' }}
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="Node Js">Node Js</MenuItem>
                <MenuItem value="React Js">React Js</MenuItem>
              </Select>
            </FormControl>

            {tech === 'javascript' ? (
              <Button
                id="run-btn"
                variant="contained"
                size="medium"
                color="success"
                onClick={() => execute(code)}
              >
                Run
              </Button>
            ) : (
              <Button
                id="run-btn"
                variant="contained"
                size="medium"
                color="success"
                onClick={() => execute(code)}
                disabled
              >
                Run
              </Button>
            )}

            {tech === 'React Js' && (
              <Button id="run-btn" variant="contained" style={{ backgroundColor: 'grey', color: 'white' }}>
                Output
              </Button>
            )}

            {theme === 'vs-dark' ? (
              <IconButton
                aria-label="darkmode"
                className="theme-button"
                onClick={() => changeTheme('vs-light')}
              >
                <DarkModeIcon fontSize="medium" />
              </IconButton>
            ) : (
              <IconButton
                aria-label="lightmode"
                className="theme-button"
                onClick={() => changeTheme('vs-dark')}
              >
                <LightModeOutlinedIcon fontSize="medium" />
              </IconButton>
            )}
          </div>

          {code === '' ? (
            <Button id="submit-btn" variant="contained" size="medium" color="error" disabled>
              Submit
            </Button>
          ) : (
            <Button id="submit-btn" variant="contained" size="medium" color="success" onClick={handleCodeSubmit}>
              Submit
            </Button>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default EditorNav;
