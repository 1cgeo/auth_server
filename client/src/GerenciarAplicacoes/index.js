import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useAsync } from 'react-async-hook'
import TextField from '@material-ui/core/TextField'

import { getAplicacoes, atualizaAplicacao, deletaAplicacao, criaAplicacao } from './api'
import { MessageSnackBar, MaterialTable } from '../helpers'
import styles from './styles'

export default withRouter(props => {
  const classes = styles()

  const [aplicacoes, setAplicacoes] = useState([])
  const [snackbar, setSnackbar] = useState('')
  const [refresh, setRefresh] = useState(false)

  useAsync(async () => {
    try {
      const response = await getAplicacoes()
      if (!response) return

      setAplicacoes(response)
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
  }, [refresh])

  const handleAdd = async newData => {
    try {
      const response = await criaAplicacao(newData)
      if (!response) return

      setSnackbar({ status: 'success', msg: 'Aplicação adicionada com sucesso', date: new Date() })
      setRefresh(new Date())
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

  const handleUpdate = async (newData, oldData) => {
    try {
      const response = await atualizaAplicacao(newData)
      if (!response) return

      setSnackbar({ status: 'success', msg: 'Aplicação atualizada com sucesso', date: new Date() })
      setRefresh(new Date())
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

  const handleDelete = async oldData => {
    try {
      const response = await deletaAplicacao(oldData.id)
      if (!response) return

      setSnackbar({ status: 'success', msg: 'Aplicação deletada com sucesso', date: new Date() })
      setRefresh(new Date())
    } catch (err) {
      setSnackbar({ status: 'error', msg: 'Ocorreu um erro ao se comunicar com o servidor.', date: new Date() })
    }
  }

  return (
    <>
      <MaterialTable
        title='Aplicações'
        columns={[
          {
            title: 'Aplicação',
            field: 'nome',
            editComponent: props => (
              <TextField
                type='text'
                value={props.value}
                label='Nome da aplicação'
                className={classes.textField}
                onChange={e => props.onChange(e.target.value)}
              />
            )
          },
          { title: 'Nome abreviado', field: 'nome_abrev' },
          { title: 'Ativa', field: 'ativa', type: 'boolean' }
        ]}
        data={aplicacoes}
        editable={{
          onRowAdd: handleAdd,
          onRowUpdate: handleUpdate,
          onRowDelete: handleDelete
        }}
      />
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
