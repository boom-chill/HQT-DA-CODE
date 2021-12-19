import React, { useEffect, useState } from 'react';
import './Upload.scss'
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux';
import { FormManager, NumberInput, SelectInput, TextInput, CheckBoxInput } from './../../Components/CustomForm/CustomForm';
import { addProducts, updateProducts } from '../../feature/productsSlice';

function Upload(props) {

    const { id } = useParams();
    const [branchs, setBranchs] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector((state) => state.user.data)

    const [fixed, setFixed] = useState(false)

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit, setInitial } = FormManager({
        initialValue: {
            TENSP: '',
            GIA: '',
            CHINHANHID: '',
        }
    })

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/partner-branch`, {
                params: {
                    id: user.info.DOITACID
                }
            }).then(
                (res) => {
                    const branchs = [...res.data]
                    let newBranchs = []
                    branchs.forEach((branch) => {
                        const newBranch = {
                            label: branch.CHINHANHID,
                            value: branch.CHINHANHID,
                        }
                        newBranchs.push(newBranch)
                    })
                    setBranchs(newBranchs)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const onSubmit = (data) => {
        submitTrigger()
        if (!isError) {
            if (!fixed) {
                axios.post(`${baseUrl}/api/test2-partner`, {
                    ...data,
                }).then(
                    (res) => {
                        dispatch(updateProducts(res.data))
                    }
                )
            } else {
                axios.post(`${baseUrl}/api/test2-partner-fix`, {
                    ...data,
                }).then(
                    (res) => {
                        dispatch(updateProducts(res.data))
                    }
                )
            }
        }
    }

    return (
        <div className='edit wide'>

            <h1>
                Thêm sản phẩm
            </h1>

            <div>
                <div className='edit-info'>

                    <div className='edit-info__text'>
                        <CheckBoxInput
                            label='Fixed dirty read 1'
                            defaultChecked={fixed}
                            onChange={(e) => setFixed(e.value)}
                        />

                        <TextInput
                            name='TENSP'
                            label='Tên sản phẩm'
                            onChange={onFormChange}


                            required
                            isSubmit={isSubmit}
                        />
                    </div>

                    <div className='edit-info__text price'>
                        <NumberInput
                            name='GIA'
                            label='Giá'
                            onChange={onFormChange}


                            required
                            isSubmit={isSubmit}
                        />
                    </div>

                    <div className='edit-info__text'>
                        <SelectInput
                            name='CHINHANHID'
                            label='Chi nhánh'
                            options={branchs}
                            onChange={onFormChange}

                            required
                            isSubmit={isSubmit}
                        />
                    </div>

                    <div className='prodcut-card__btn' style={{ width: '100%', maxWidth: '250px' }}>
                        <div className='prodcut-card__btn--wrapper'
                            onClick={() => handleSubmit(onSubmit)}
                        >
                            Thêm
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
}

export default Upload;