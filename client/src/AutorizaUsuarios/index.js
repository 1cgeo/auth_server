import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import { useAsync } from 'react-async-hook'

import { getUsuarios, autorizarUsuarios, resetarSenhas } from './api'
import { MessageSnackBar, MaterialTable, DialogoConfirmacao } from '../helpers'

export default withRouter(props => {
  const [usuarios, setUsuarios] = useState([])
  const [snackbar, setSnackbar] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState({})

  useAsync(async () => {
    try {
      const response = await getUsuarios()
      if (!response) return
      setUsuarios(response)
    } catch (err) {
      setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
    }
  }, [refresh])

  const handleAutorizarUsuario = (event, data) => {
    setOpenConfirmDialog({
      open: true,
      title: 'Autorizar usuário',
      msg: 'Deseja realmente autorizar os usuários selecionados?',
      handleDialog: executeAutorizarUsuario(data)
    })
  }

  const executeAutorizarUsuario = data => {
    return async (confirm) => {
      if (confirm) {
        try {
          const uuids = data.map(d => (d.uuid))
          const success = await autorizarUsuarios(uuids)
          if (success) {
            setSnackbar({ status: 'success', msg: 'Usuários autorizados com sucesso', date: new Date() })
            setRefresh(new Date())
          }
        } catch (err) {
          setRefresh(new Date())
          if (
            'response' in err &&
            'data' in err.response &&
            'message' in err.response.data
          ) {
            setSnackbar({ status: 'error', msg: err.response.data.message, date: new Date() })
          } else {
            setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
          }
        }
      }
      setOpenConfirmDialog({})
    }
  }

  const handleResetarSenha = (event, data) => {
    setOpenConfirmDialog({
      open: true,
      title: 'Reseta senhas',
      msg: 'Deseja realmente resetar a senha dos usuários selecionados?',
      handleDialog: executeResetarSenha(data)
    })
  }

  const executeResetarSenha = data => {
    return async (confirm) => {
      if (confirm) {
        try {
          const uuids = data.map(d => (d.uuid))
          const success = await resetarSenhas(uuids)
          if (success) {
            setSnackbar({ status: 'success', msg: 'Senhas resetadas com sucesso', date: new Date() })
            setRefresh(new Date())
          }
        } catch (err) {
          if (
            'response' in err &&
            'data' in err.response &&
            'message' in err.response.data
          ) {
            setSnackbar({ status: 'error', msg: err.response.data.message, date: new Date() })
          } else {
            setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
          }
        }
      }
      setOpenConfirmDialog({})
    }
  }

  return (
    <>
      <MaterialTable
        title='Usuários'
        columns={[
          { title: 'Login', field: 'login' },
          { title: 'Posto/Graducao', field: 'tipo_posto_grad' },
          { title: 'Nome Guerra', field: 'nome_guerra' },
          { title: 'Nome completo', field: 'nome' },
          { title: 'Ativo', field: 'ativo', type: 'boolean' },
          { title: 'Administrador', field: 'administrador', type: 'boolean' }
        ]}
        data={usuarios}
        actions={[
          {
            icon: DoneAllIcon,
            tooltip: 'Autorizar usuário',
            onClick: handleAutorizarUsuario
          },
          {
            icon: LockOpenIcon,
            tooltip: 'Resetar senha',
            onClick: handleResetarSenha
          }
        ]}
        options={{
          selection: true,
          selectionProps: rowData => ({
            disabled: rowData.administrador
          })
        }}
      />
      {openConfirmDialog ? (
        <DialogoConfirmacao
          open={openConfirmDialog.open}
          title={openConfirmDialog.title}
          msg={openConfirmDialog.msg}
          onClose={openConfirmDialog.handleDialog}
        />
      ) : null}
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
