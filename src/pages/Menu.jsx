import React from 'react';
import MenuList from '../components/MenuList'
import { Header, Grid, Item, Icon, Container, Button } from 'semantic-ui-react'
import Registration from '../components/Registration';
import axios from 'axios';
import ItemList from '../components/ItemList'

class Menu extends React.Component {
  state = {
    authenticated: false
  }
  setAuthentication = () => {
    this.setState({ authenticated: true })
  }

  addToOrder = async (product) => {
    let authHeader = JSON.parse(localStorage.getItem("credentials"))
    if (!this.state.currentOrder) {
      try {
        let response = await axios.post(
          "/orders",
          { product_id: product.id },
          { headers: authHeader })
        this.setState({
          orderMessage: `${product.title} was added to your order`,
          currentOrder: response.data.order
        })
      }
      catch (error) {
        this.setState({ orderMessage: "Product couldn't be added to your order. Try again later" })
      }
    } else {
      try {
        let response = await axios.put(
          `/orders/${this.state.currentOrder.id}`,
          { product_id: product.id, order_id: this.state.currentOrder.id },
          { headers: authHeader })
        this.setState({
          currentOrder: response.data.order,
          orderMessage: `${product.title} was added to your order`
        })
      } catch (error) {
        this.setState({ orderMessage: "Product couldn't be added to your order. Try again later" })
      }
    }
  }

  confirmOrder = async () => {
    let authHeader = JSON.parse(localStorage.getItem("credentials"))
    try {
      let response = await axios.put(
        `/orders/${this.state.currentOrder.id}`,
        { order_id: this.state.currentOrder.id, confirmed: true },
        { headers: authHeader })
      this.setState({
        currentOrder: undefined,
        orderMessage: response.data.message
      })
    }
    catch (error) {

    }
  }

  render() {
    const { orderMessage, currentOrder, authenticated } = this.state
    return (
      <Container className="page-container" fluid>
        <Grid textAlign="center" divided="vertically" >
          <Header as="h1" className="header">
            <Icon name="gulp" />
            <Header.Content>
              Spora Hrana
            <Header.Subheader>Menu List</Header.Subheader>
            </Header.Content>
          </Header>
          <Grid.Row textAlign="center">
            <Registration setAuthentication={() => this.setAuthentication()} />
          </Grid.Row>
          {orderMessage && (
            <div >
              <p id="order-message">{orderMessage}</p>
              {currentOrder && (
                <div>
                  <p id="order-length">You have {currentOrder.items.length} {currentOrder.items.length > 1 ? "items" : "item"} in your order</p>
                  <ItemList orderList={currentOrder.items} />
                  <Button data-cy="confirm-button" onClick={() => this.confirmOrder()} />
                </div>
              )}
            </div>
          )}
          <Grid.Row>
            <Item.Group>
              <MenuList addToOrder={this.addToOrder} authenticated={authenticated} />
            </Item.Group>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default Menu