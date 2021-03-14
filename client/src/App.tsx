import React from 'react';
import './App.scss';
import {createApiClient, Ticket as TicketType} from './api';
import Ticket from './Ticket';

export type AppState = {
	tickets?: TicketType[],
	search: string,
	hiddenIds: number[],
	darkMode: boolean,
	counter: number,
	sorted: boolean;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		hiddenIds: [],
		darkMode: false,
		counter: 1,
		sorted: false
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.search, 1, false)
		});
	}

	renderDarkModeButton = () => {
		return (
		<div>
		  <button className='darkModeButton' onClick={() => { this.setState({ darkMode: !this.state.darkMode })}}>
			{this.state.darkMode ? 'Default' : 'Dark Mode'}
		  </button>
		</div>);
	  }

	onHide = (index: number) => {
		const newIds = [...this.state.hiddenIds,index];
		this.setState({hiddenIds: newIds})
	}

	restoreHide = () => {
		this.setState({hiddenIds: []})
	}

	renderTickets = (tickets: TicketType[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		return (<ul className='tickets'>
			{filteredTickets.map((ticket, index) => (<Ticket key={index} ticket={ticket} hide={this.state.hiddenIds.includes(index)} onHide={() => this.onHide(index)}/>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val,
				tickets: await api.getTickets(val, 1, this.state.sorted)
			});
		}, 300);
	}
	showMoreButton = (counter: number) => {
		return (
			<div>
			  <button className='darkModeButton' onClick={async () => {
				  const current = this.state.tickets || [];
				  const next = await api.getTickets(this.state.search, counter, this.state.sorted)
				  	this.setState({ tickets: [...current, ...next], counter: counter+1})
				  }}>
			show more
			  </button>
			</div>);
	}
	showSortButton = () => {
		return (
			<div>
			  <button className='darkModeButton' onClick={async () => {
				  this.restoreHide();
				  const sortedTickets = await api.getTickets(this.state.search, 1, true)
				  	this.setState({ tickets: [ ...sortedTickets], counter: 1, sorted: true})
				  }}>
			sort by date
			  </button>
			</div>);
	}
	render() {	
		const {tickets, darkMode} = this.state;
		document.body.className = darkMode ? 'darkMode' : '';
		const hiddenTickets = this.state.hiddenIds.length < 0 ? 'ticket' : 'tickets';

		return (<main>
			{this.renderDarkModeButton()}
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets && this.showSortButton()}
			{tickets ? 
					<div className='results'>Showing {tickets.length} results 
						{this.state.hiddenIds.length !== 0 ?
							<span> ({this.state.hiddenIds.length} hidden {hiddenTickets} - 
								<a onClick={this.restoreHide}> restore</a>)
							</span> : null}
					</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			{tickets && this.showMoreButton(this.state.counter + 1)}
			
		</main>)
	}
}

export default App;