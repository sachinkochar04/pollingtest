import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { PenIcon, DeleteIcon } from 'mdi-react';
import { 
    Alert,
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Button,
    CardHeader,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import TopBar from './Common/TopBar.jsx';
import { database } from '../Inc/firebase.js'
class Questions extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            title:'',
            add:false,
            stepCount : 0,
            options:[],
            allOptions:[],
            message:'',
            question: {}
        }
    }

    onChangeHandler = (name,value)=>{
        this.setState({ [name]: value })
    }

    onOptionsChangeHandler =(i,name, value)=>{
        let { options } = this.state;
        options[i-1].title = value 
        this.setState({ options })
    }
    onSaveHandler = () =>{
        let { title, options } = this.state
        options.map((data)=>{
            return data.poll = 0 
        })
        let data = {
                title,
                allOptions:options,

        }
        database.ref(`/questions`).set(data).then(()=>{
            this.setState({ 
                add:false,
                message:'Success',            
            })

        }).catch((err)=>{
            this.setState({ 
                message:'Error saving question, please try again',            
            })
        })

    }


    addStepCount = () => {
        let { options, stepCount } = this.state;
        stepCount = ++stepCount
        let data = {
            title:'',
            poll:0
        }
        options.push(data)
        this.setState({ stepCount ,options  });
    }   
    
    subStepCount = () => {
        let { options, stepCount } = this.state;
        stepCount = --stepCount
        options.pop()
        this.setState({ stepCount ,options  });
    }

    componentDidMount(props){
            this.setState({ loading: true })
            var self = this;
            database.ref('/questions/').on('value', function(snapshot) {
                let question = {}
                if(snapshot.val()){
                    question.title = snapshot.val().title 
                    question.allOptions = snapshot.val().allOptions 
                    self.setState({ question, loading:false })
                }else{
                    self.setState({ loading:false })
                }
                
            });
    }

    onEditHandler= () =>{
        this.setState({
            title : this.state.question.title,
            options : this.state.question.allOptions,
            stepCount:this.state.question.allOptions.length,
            add: true
        })
    }

    onDeleteHandler= () =>{
        this.setState({ loading : true })
        database.ref(`questions/`).remove();
        this.setState({
            message : 'Question deleted',
            question:'',
            loading:false
        })
    }

    componentWillUnmount(){
        database.ref('/questions/').off();
    }    

    render() {
        let { loading, message, add, stepCount, options, question } = this.state
        let optionsArray = [];
        for(let i = 0 ; i< stepCount; i++ ){
            optionsArray[i] =(
                <Col md={6} key={i}> 
                    <FormGroup>
                        <Label>
                            {`Option ${i+1}`}
                        </Label>
                        <Input name={i+1} type="text" placeholder={`Enter Option ${i+1}`} value={ options[i].title } onChange={ (e) => { this.onOptionsChangeHandler(i+1,e.target.name,e.target.value) } } />
                    </FormGroup>
                </Col>
            )
        }
        return(
            <div>
                <TopBar />
                <Container>
                { message && (
                    <Alert className="alert-abs" color="success">
                        {message}
                    </Alert>
                )}
                {loading ? (
                    <div className="text-center m-auto">
                        <img src={require('../assets/images/spinner.gif')} alt="loading..." />
                    </div>
                ) : (

                    <Row className="mt-2">
                        <Col sm={12} md={{ size: 4 }} lg={{ size: 4 }}>
                            <Card>
                            <CardHeader>Question:
                                    {question.title && (
                                        <>
                                            <PenIcon onClick={ ()=>{ this.onEditHandler() } } className="abs-right" /> 
                                            <DeleteIcon onClick={ ()=>{ this.onDeleteHandler() } } className="abs-right-del" /> 
                                        </>
                                    )}
                                </CardHeader>
                                <CardBody>
                                    {question.title && question.allOptions ? (
                                         <CardBody>
                                            <CardTitle>{`${question.title} ?`}</CardTitle>
                                            {/* <CardSubtitle>Card subtitle</CardSubtitle> */}
                                            <ul className="list-style-none">    
                                                { question.allOptions && question.allOptions.map((option,i)=>{
                                                    return(
                                                        <li key={ i }>{ `${i+1} ) ${option.title}` }</li>
                                                    )
                                                })}
                                            </ul>
                                       </CardBody>
                                    ) : (
                                        <div>
                                            <p className="text-muted">No Question Created Yet</p>
                                            <p className="cursor-pointer" onClick={ ()=>{ this.setState({ add: !add }) } }><span>+</span><span className="text-muted"> Add</span></p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                        {add && (
                            <Col sm={12} md={{ size: 8 }} lg={{ size: 8 }}>
                                <Card>
                                <CardHeader>Add Question</CardHeader>
                                    <CardBody>
                                        <Form>
                                            <Row form>
                                            <Col md={12} sm={12}>
                                                <FormGroup>
                                                    <Label>
                                                        Question Title
                                                    </Label>
                                                    <Input name="title" type="text" value={ this.state.title } placeholder="Enter Title of question" onChange={ (e) => { this.onChangeHandler(e.target.name,e.target.value) } } />
                                                </FormGroup>
                                            </Col>
                                            <Col md={12} sm={12} className="mb-1">
                                                <Button color="primary" className="mr-1" onClick={ () => { this.addStepCount(); } }>+</Button>
                                                { stepCount > 0 && (
                                                    <Button color="primary" onClick={ () => { this.subStepCount(); } }>-</Button>
                                                )}
                                            </Col>
                                            { optionsArray }
                                            <Col md={12} sm={12} >
                                                <Button color="primary" onClick={ ()=>{this.onSaveHandler()} }>Save</Button>
                                            </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        )}
                    </Row>
                )}
                </Container>
            </div>
        )
    }
}


export default  withRouter(Questions);