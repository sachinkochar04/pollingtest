import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PenIcon from 'mdi-react/PenIcon';
import { 
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    CardHeader,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import TopBar from './Common/TopBar.jsx';
import { auth, database } from '../Inc/firebase.js'
class Questions extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            title:'',
            active:false,
            add:false,
            stepCount : 0,
            options:[],
            allOptions:[],
            message:'',
            question: new Object
        }
    }

    onChangeHandler = (name,value)=>{
        this.setState({ [name]: value })
    }

    onOptionsChangeHandler =(i,name, value)=>{
        console.log('name','value',name,value);
        let { options } = this.state;
        options[i-1].title = value 
        this.setState({ options })
    }
    onSaveHandler = () =>{
        let { title, options } = this.state
        let { allStates } = this.props
        let data = {
                title,
                allOptions:options,
                isActive : true,

        }
        this.setState({ add:false })
        database.ref(`/questions`).set(data);

    }

    onActiveHandler = () => {
        let { question } = this.state; 
        let data = {
            isActive :!question.isActive
        }
        let uid = auth.currentUser.uid;
        database.ref(`questions/`).update(data)
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
                    question.isActive = snapshot.val().isActive;
                    self.setState({ question, loading:false })
                }
                
            });
    }

    onEditHandler= () =>{
        let { question } = this.state; 
        question.isActive = false;
        let data = {
            question
        }
        let uid = auth.currentUser.uid;
        database.ref(`questions/`).update(data)
        this.setState({
            title : this.state.question.title,
            options : this.state.question.allOptions,
            stepCount:this.state.question.allOptions.length,
            add: true
        })
    }
    

    render() {
        let { loading, active, add, stepCount, options, question } = this.state
        console.log('options', question)
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
                {loading ? (
                    <div className="text-center m-auto">
                        <img src={require('../assets/images/spinner.gif')} />
                    </div>
                ) : (

                    <Row className="mt-2">
                        <Col sm={12} md={{ size: 4 }} lg={{ size: 4 }}>
                            <Card>
                            <CardHeader>Question:
                                    {question.title && (
                                        <>
                                            <span className="text-center ml-2 text-muted">  {question.isActive ? 'Active' : 'InActive'} </span>
                                            <PenIcon onClick={ ()=>{ this.onEditHandler() } } className="abs-right" /> 
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
                                            {/* <Button color="primary" className="mr-1">Save</Button>  */}
                                            { question.isActive ? (
                                                    <Button color="danger" onClick={()=>{ this.onActiveHandler()}}>inActive</Button>
                                                ) : (
                                                    <Button color="success" onClick={()=>{ this.onActiveHandler()}}>Active</Button>
                                                ) }
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


const mapStateToProps = (state) => {
    const allStates = state;
    console.log("State", allStates);
    return { allStates };
  }

// const mapDispatchToProps = (dispatch, props) => {
//     return {
//       _login: (data) => {
//         dispatch(loginAction(data));
//       },
//       checkLogin : () => {
//           dispatch(checkLoginAction())
//       }
//     }
// }


export default  withRouter(connect(mapStateToProps)(Questions));