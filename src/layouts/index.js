import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button, Table, message } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '税号',
    dataIndex: 'ein',
    key: 'ein',
  },
  {
    title: '车号',
    dataIndex: 'car',
    key: 'car',
  },
]

function BasicLayout(props) {
  const [ein, setEin] = useState();
  const [car, setCar] = useState();
  const [id, setId] = useState(0);
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(0);

  return (
    <Body>
      <Title>出租车票筛查</Title>
      <SmallTitle>发票编码:</SmallTitle>
      <StyledInput placeholder='55553925' value={ein} onChange={e => setEin(e.target.value)} />
      <div />
      <SmallTitle>出租车号:</SmallTitle>
      <StyledInput placeholder='R0323' value={car} onChange={e => setCar(e.target.value)} />
      <div />
      <StyledButton type="primary" onClick={() => {
        if (isNaN(ein)) {
          message.error('税号必须是数字');
          return;
        }
        let newData = data.slice();
        newData.push({
          id: id + 1,
          ein, car
        });
        setId(id + 1);
        setData(newData);
        setEin(undefined);
        setCar(undefined);
        setPage(0);
      }}>添加</StyledButton>
      <StyledButton type="primary" onClick={() => {
        const dataCopy = data.slice();
        const newResult = filter(dataCopy);
        newResult.sort((a, b)=>a.id - b.id);
        console.log('result', newResult);
        setResult(newResult);
        setPage(1);
      }}>筛查</StyledButton>
      <div />
      <Tab selected={page === 0} onClick={()=>setPage(0)}>当前号码</Tab>
      <Tab selected={page === 1} onClick={()=>setPage(1)}>筛选结果</Tab>
      {
        page === 0
        ? <StyledTable size='small' columns={columns} dataSource={data} pagination={{pageSize: 200}} />
        : <StyledTable size='small' columns={columns} dataSource={result} />
      }
      <div style={{ marginTop: '10px' }}>*提示：可以只输入后3位.</div>
    </Body>
  );
}

export default BasicLayout;

const Body = styled.div`
  width: 375px;
  min-height: 667px;
  background-color: #99d9f1;
  margin:auto;
  border-radius: 30px;
  text-align: center;
`;

const Title = styled.div`
  font-size: 20px;
  margin: auto;
  padding: 20px;
`;

const SmallTitle = styled.span``;

const StyledInput = styled(Input)`
  width: 180px;
  border-radius: 5px;
  margin: 0px 15px 15px 15px;
`;

const StyledButton = styled(Button)`
  width: 120px;
  margin: 0 5px 5px 15px;
  border-radius: 15px;
`;

const Tab = styled.span`
  background-color: ${props => props.selected ? '#9bffd5' : '#b9eae1'};
  padding: 20px 60px 20px 60px;
  line-height: 80px;
`;

const StyledTable = styled(Table)`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 0px;
`;


function filter(arr, distance = 50) {
  arr = arr.sort((a, b) => {
    return a.car > b.car ? 1 : -1;
  });
  let selected = [];
  let lastCar;
  let codes = [];
  for (let i = 0; i < arr.length; i++) {
    let car = arr[i].car;
    let code = arr[i].ein;
    if (!lastCar || car !== lastCar.car) {
      codes = [];
      lastCar = arr[i];
    }
    for (let m = 0; m < codes.length; m++) {
      if (Math.abs(Number(code) - Number(codes[m])) <= distance) {
        selected.push(arr[i]);
        selected.push(lastCar);
      }
    }
    codes.push(code);
  }
  return selected;
}

