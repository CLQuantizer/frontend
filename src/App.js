import React, {useState, useEffect} from "react"
import { MdBuild } from "react-icons/md"
import { ChakraProvider,Button,Box,VStack,Grid,Badge} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { FormLabel,Input} from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy } from 'react-table'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const theme = extendTheme({ colors })

const makeData = (words,probs)=>{
     let results = [];
     for(let i=0;i<words.length;i++){
      results.push({word:words[i],prob:probs[i]});
     }
     return results
   }  


function WordForm() {
  const [data, setData] = useState([]);
  const [word, setWord] = useState("go");
  function DataTable(json) {  
    const columns = React.useMemo(
      () => [
        {
          Header: 'words',
          accessor: 'word',
        },
        {
          Header: 'Relatedness',
          accessor: 'prob',
        } 
      ],
      [],
    )
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy)

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render('Header')}
                <chakra.span pl='4'>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label='sorted descending' />
                    ) : (
                      <TriangleUpIcon aria-label='sorted ascending' />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
  const handleSubmit = (event) => {
    event.preventDefault();
    var url = 'http://langedev.net:8000/related/'+word;
    const response = fetch(url,{method:'POST'})
    const json = response.json();
    console.log(json);
    alert(`The name you entered was: ${word}`)
    var results = makeData(json.words,json.probs);
    console.log(results);
       setData(results);
  }
  return (
    <form onSubmit={handleSubmit}>
      <FormLabel>Enter your word:
        <Input 
          type="text" 
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
      </FormLabel>
      <Button type="submit">submit</Button>
    </form>
  );
}

function Count(){
  const [cnt,setCnt] = useState(0);
  var times = 'time'; 
  if(cnt<2){times='time';}
  else{times='times';}
  useEffect(()=>{
      document.title = '厉不厉害！ '+cnt+ ' '+times;
    });
  return <div>
          <p>兄弟给刷666！！ {cnt} {times}</p>
          <Button onClick={()=>setCnt(cnt+1)}>Click Me</Button>
         </div>
}

function App(){
  return(
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo h="15vmin" pointerEvents="none" />
           <Button leftIcon={<MdBuild />} colorScheme='pink' variant='solid'>Settings</Button>
            {Count()}
            {WordForm()}
           <Badge colorScheme = 'teal' >Knight of the night</Badge>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
  );
}
export default App;