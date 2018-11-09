import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle, CardDeck, CardText  } from 'reactstrap';
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
                                        <Col md={12} sm={12}>
                                            <h3>Question:- <span className="text-muted">{ question && question.title }</span></h3>
                                        </Col>
                                        <CardDeck>

                                            {question.allOptions && question.allOptions.map((option,i)=>{
                                                return(
                                                            <Card  width="100%" key={i}>
                                                                <CardBody>
                                                                    <CardTitle>Option:-{ option.title }</CardTitle>
                                                                    <CardText>Polls:- { option.poll }</CardText>
                                                                </CardBody>
                                                            </Card>
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