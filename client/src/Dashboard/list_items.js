import React from 'react'
import { NavLink } from "react-router-dom"
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import PersonIcon from '@material-ui/icons/Person'
import CreateIcon from '@material-ui/icons/Create'
import GroupIcon from '@material-ui/icons/Group';
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'

import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles(theme => ({
  active: {
    backgroundColor: theme.palette.action.selected
  }
}))

export const MainListItems = props => {
  const classes = styles()

  return (
    <List>
    <Divider />
    <ListItem button component={NavLink} exact to="/" activeClassName={classes.active}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary='Informações do usuário' />
    </ListItem>
    <ListItem button button component={NavLink} exact to="/alterar_senha" activeClassName={classes.active}>
      <ListItemIcon>
        <LockOpenIcon />
      </ListItemIcon>
      <ListItemText primary='Alterar senha' />
    </ListItem>
    </List>
)}

export const AdminListItems = props => {
  const classes = styles()

  return (
    <List>
    <Divider />
    <ListSubheader inset>Administração</ListSubheader>
    <ListItem button component={NavLink} exact to="/gerenciar_usuarios" activeClassName={classes.active}>
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary='Gerenciar usuários' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary='Last quarter' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary='Year-end sale' />
    </ListItem>
    </List>
)}