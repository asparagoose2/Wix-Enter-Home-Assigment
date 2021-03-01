import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import { parseConfigFileTextToJson } from 'typescript';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	fontsize: number;
}

var FontSize = {"SMALL": 14,"NORMAL": 16,"LARGE": 18}

const api = createApiClient();

const showHide = (id: string) => {

	var x = document.getElementById(id);
	var text = x!.querySelector(".show-more")!.textContent!.toUpperCase();

	if(text === "SHOW MORE")
	{
		text = "Show Less";
		let cont = x!.querySelector(".contentHide")
		cont!.classList.add("contentShow");
		cont!.classList.remove("contentHide");
	} else {
		text = "Show Less";
		let cont = x!.querySelector(".contentShow")
		cont!.classList.add("contentHide");
		cont!.classList.remove("contentShow");
	}
	x!.querySelector(".show-more")!.textContent! = text;

}


export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		fontsize: FontSize.NORMAL
	}
	
	flipPin = (id: string) => {
		this.setState({
			tickets: this.state.tickets!.map((tkt) => { if(tkt.id == id) {tkt.isPinned = !tkt.isPinned;} return tkt;})
		})
	}

	setFontSize = (size: number) => {
		this.setState({
			fontsize: size
		})
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await (await api.getTickets()).map((tkt: Ticket) => {tkt.isPinned = false; return tkt})
		});
	}

	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.filter((t) => (t.isPinned)).map((ticket) => (<li id={ticket.id}  className='ticket'>
				<h5 className='title' style={{fontSize : this.state.fontsize}} >{ticket.title}</h5>
				<p className='contentHide' style={{fontSize : this.state.fontsize -2}}>{ticket.content}</p>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<button onClick={(e: React.MouseEvent) => {this.flipPin(ticket.id)}} type="button">Unpin</button>
				</footer>
			</li>))}
			{filteredTickets.filter((t) => (!t.isPinned)).map((ticket) => (<li id={ticket.id} key={ticket.id} className='ticket'>
				<h5 className='title' style={{fontSize : this.state.fontsize}}>{ticket.title}</h5>
				<p className='contentHide'  style={{fontSize : this.state.fontsize-2}}>{ticket.content}</p>
				{/* <a href="#" className="show-more" onClick={(e: React.MouseEvent) => {document.getElementById(ticket.id)!.classList.add("contentShow"); document.getElementById(ticket.id)!.classList.remove("contentHide")}}>Show more</a> */}
				<a href="#" className="show-more" onClick={(e: React.MouseEvent) => {showHide(ticket.id)}}>Show more</a>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div> 
					<button onClick={(e: React.MouseEvent) => {this.flipPin(ticket.id)}} type="button">Pin</button>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	<button onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.SMALL)}} type="button">small font</button>
			<button onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.NORMAL)}} type="button">normal font</button>
			<button onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.LARGE)}} type="button">large font</button><div><br></br></div>
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;