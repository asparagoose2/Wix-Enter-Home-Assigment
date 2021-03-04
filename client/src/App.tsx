import React from 'react';
import './App.scss';
import {createApiClient, Ticket, cloneTicket} from './api';
import { TicketComponent } from './components/ticket';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	fontsize: number,
	darkMode: boolean,
	currentPage: number,
	totalPages: number;
}

var FontSize = {"SMALL": 14,"NORMAL": 16,"LARGE": 18};


const api = createApiClient();

const showHide = (id: string) => {

	var x = document.getElementById(id);
	var text = x!.querySelector(".show-more")!.textContent!.toUpperCase();

	if(text === "SHOW MORE")
	{
		text = "Show less";
		let cont = x!.querySelector(".contentHide")
		cont!.classList.add("contentShow");
		cont!.classList.remove("contentHide");
	} else {
		text = "Show more";
		let cont = x!.querySelector(".contentShow")
		cont!.classList.add("contentHide");
		cont!.classList.remove("contentShow");
	}
	x!.querySelector(".show-more")!.textContent! = text;

}

function checkOverflow(id: string)
{
	let el = document.getElementById(id) as HTMLElement;

	if(document.body.contains(el))
	{
		var curOverflow = el.style.overflow;

		if ( !curOverflow || curOverflow === "visible" )
			el.style.overflow = "hidden";

		var isOverflowing = el.clientWidth < el.scrollWidth 
			|| el.clientHeight < el.scrollHeight;

		el.style.overflow = curOverflow;

		return isOverflowing;
	}
}


function showMoreOverflowCheck()
{
	let Elements = document.getElementsByClassName("contentHide") as HTMLCollectionOf<HTMLElement>;
	for(let i = 0; i < Elements.length; i++)
	{
		if(!checkOverflow(Elements[i].id))
		{
			document.getElementById(Elements[i].id+"show")!.style.visibility="hidden";
		}	
	}
}

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		fontsize: FontSize.NORMAL,
		darkMode: true,
		currentPage: 1,
		totalPages: 1,
	}
	  
	async reloadTickets() {
		  var tempTickets = await api.getTickets(this.state.currentPage);
		  this.setState({
			  tickets: tempTickets
			})
		}
		
	flipPin = (id: string) => {
			this.setState({
				tickets: this.state.tickets!.map((tkt) => { if(tkt.id === id) {tkt.isPinned = !tkt.isPinned;} return tkt;})
			})		
	}

	clone = async (id: string) => {
		const toClone = this.state.tickets!.find((t) => t.id === id);
		if(toClone)
		{
			await cloneTicket(toClone);
			this.reloadTickets();
		}
	}
		
	componentDidUpdate () {
			showMoreOverflowCheck();
	}
										
	async loadMore() {
		if(this.state.currentPage < this.state.totalPages)
		{
			this.setState({
				currentPage: await (this.state.currentPage + 1)
			});
			this.setState({
				tickets: await api.getTickets(this.state.currentPage),
				totalPages: await api.numOfPages()
			})
		}
		if(this.state.currentPage === this.state.totalPages)
		{
			(document.getElementById('loadMore') as HTMLInputElement).style.visibility = "hidden";
			(document.getElementById('noItemsToShow') as HTMLInputElement).style.visibility = "visible";
		}
	}
																					
	setFontSize = (size: number) => {
		
		if(size === FontSize.LARGE)
		{
			(document.getElementById('fontLarge') as HTMLInputElement).disabled = true;
			(document.getElementById('fontSmall') as HTMLInputElement).disabled = false;
			(document.getElementById('fontNormal') as HTMLInputElement).disabled = false;
		}
		if(size === FontSize.SMALL)
		{
			(document.getElementById('fontLarge') as HTMLInputElement).disabled = false;
			(document.getElementById('fontSmall') as HTMLInputElement).disabled = true;
			(document.getElementById('fontNormal') as HTMLInputElement).disabled = false;
		}
		if(size === FontSize.NORMAL)
		{
			(document.getElementById('fontLarge') as HTMLInputElement).disabled = false;
			(document.getElementById('fontSmall') as HTMLInputElement).disabled = false;
			(document.getElementById('fontNormal') as HTMLInputElement).disabled = true;
		}
		
		this.setState({
			fontsize: size
		})
	}
	
	darkModeToggle = () => {
		var element = document.body;
		element.classList.toggle("darkMode");
	}
														
	searchDebounce: any = null;
		
	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.currentPage),
			totalPages: await api.numOfPages(),
		});	
		this.setFontSize(this.state.fontsize);
		showMoreOverflowCheck();
	}

	search = (tickets: Ticket[]) => {

		let searchKey = this.state.search.toLocaleLowerCase().trimStart();

		if(searchKey.startsWith("before:") || searchKey.startsWith("after:") )
		{
			let temp  = searchKey.split(" ");
			let dateKey = temp[0];
			temp.shift();
			searchKey = temp.join(" ");
			temp = dateKey.split(":")
			dateKey = temp[1];
			let date = (new Date(Number(dateKey.split("/")[2]) , Number(dateKey.split("/")[1]), Number(dateKey.split("/")[0])).getTime())
			let ticketAfterSearch = tickets.filter(
				(t) => (((temp[0] === "before")? date > t.creationTime : date < t.creationTime) && 
					((t.content.toLocaleLowerCase() + t.title.toLocaleLowerCase()).includes(searchKey))))
			return ticketAfterSearch;
		}

		if(searchKey.startsWith("from:"))
		{
			let temp = searchKey.split(":")[1];
			let email = temp.split(" ")[0];
			let ticketAfterSearch = tickets.filter((t) => t.userEmail.includes(email));
			return ticketAfterSearch;
		}

		return tickets.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));;
	}
														
	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = this.search(tickets);

		if(filteredTickets)
		
		return (<ul className='tickets'>
			{ filteredTickets.filter((t) => (t.isPinned)).map((ticket) => {
				return <li key={ticket.id} id={ticket.id} className='ticket'>
					<TicketComponent ticket={ticket}
									clone={this.clone}
									fontsize={this.state.fontsize}
									flipPin={this.flipPin}
									showHide={showHide} />
					</li>
			})}
			{ filteredTickets.filter((t) => (!t.isPinned)).map((ticket) => {
				return <li key={ticket.id} id={ticket.id} className='ticket'>
					<TicketComponent ticket={ticket}
									clone={this.clone}
									fontsize={this.state.fontsize}
									flipPin={this.flipPin}
									showHide={showHide} />
					</li>
			})}
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
			<h1>
				Tickets List 					
					<label className="switch"> 
						<label className="dark-mode-lable">Dark Mode</label>
						<input type="checkbox" onChange={() => this.darkModeToggle()}/>
						<span className="slider round"></span>
					</label>
			</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			<button className="font-button" id="fontSmall"  onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.SMALL)}} type="button">Small Font</button>
			<button className="font-button" id="fontNormal"  onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.NORMAL)}} type="button">Normal Font</button>
			<button className="font-button" id="fontLarge"  onClick={(e: React.MouseEvent) => {this.setFontSize(FontSize.LARGE)}}  type="button">Large Font</button><div><br></br></div>
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}

			<div className="nav">
				<div>			
					<button className="navButton" id="loadMore"  onClick={(e: React.MouseEvent) => {this.loadMore()}}  type="button">Load More</button>
					<h3 id="noItemsToShow" style={{visibility: "hidden"}}>No more tickets to show! <span role="img" aria-label="Party Popper">🎉</span></h3>
				</div>
			</div>

		</main>)
	}
}

export default App;