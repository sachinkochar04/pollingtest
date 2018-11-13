import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardDeck, CardText, Progress  } from 'reactstrap';
import TopBar from './Common/TopBar.jsx'
import { auth, database } from '../Inc/firebase.js';

class Stats extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            question:'',
        }
    }

    componentDidMount(){
        this.setState({loading:true});
        var self= this;
        database.ref('/questions/').on('value', function(snapshot) {
        let uid = auth.currentUser.uid
        if(snapshot.val()){

            let question = {};
            question = snapshot.val();
            self.setState({ question,rawData:snapshot.val(), uid, loading:false });
        }else{
            self.setState({  uid, loading:false });
        }

        });
    }

    componentWillUnmount(){
        database.ref('/questions/').off();
    }

    render() {
        let { loading, question } = this.state;
        let reduced;
        if(question.title){
            reduced = question.allOptions.reduce((currentValue,array)=>{
                return currentValue+array.poll
            },0)
        }
        return(
            <div>
                <TopBar />
                <Container>
                    {loading ? (
                        <div className="text-center m-auto">
                            <img src={require('../assets/images/spinner.gif')} alt="loading..."/>
                        </div>
                    ) : (
                        <Row className="mt-2">
                            <Col md={12} sm={12}>
                                <h1>Stats</h1>
                                <hr></hr>
                            </Col>
                            {
                                question.title ? (
                                    <>
                                        <Col md={12} sm={12} className="mb-20">
                                            <h3>Question:- <span className="text-muted">{ question && question.title }</span></h3>
                                        </Col>
                                        <CardDeck>

                                            {question.allOptions && question.allOptions.map((option,i)=>{
                                                let pollPercentage = option.poll === 0 ? 0 : (option.poll/reduced*100).toFixed(2)
                                                return(
                                                    <Col md={4} sm={4} className="mb-20" key={i}>
                                                            <Card  width="100%" key={i}>
                                                                <CardBody>
                                                                    <CardTitle>Option:-{ option.title }</CardTitle>
                                                                    <CardText>Polls:- { pollPercentage + '%' }</CardText>
                                                                    <Progress value={ pollPercentage } />
                                                                </CardBody>
                                                            </Card>
                                                    </Col>
                                                )
                                            }) 

                                            }
                                        </CardDeck>
                                    </>
                                ):(
                                    <Col md={12} sm={12}>
                                        <h3><span className="text-muted">No question created yet!</span></h3>
                                    </Col>

                                )
                            }
                        </Row>
                    )}
                </Container>
            </div>
        )
    }
}

export default withRouter(Stats);