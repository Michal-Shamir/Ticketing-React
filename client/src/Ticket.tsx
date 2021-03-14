import React from 'react';
import './App.scss';
import {Ticket as TicketType} from './api';
import ShowMoreText from 'react-show-more'

type ticketType = {ticket: TicketType, 
    hide: boolean,
    onHide: any,
};

const Ticket = ({ticket, hide, onHide}: ticketType) => {

    return (<li key={ticket.id} className={`ticket ${hide && 'hide'}`}>
    <button className='hideButton'onClick={onHide}>Hide</button>
    <h5 className='title'>{ticket.title}</h5>
    <span className='content'> 
    <ShowMoreText
                    lines={3}
                    more="See more"
                    less="See less"
                    anchorClass="ShowMore"
                >
                    {ticket.content}
    </ShowMoreText> 
    </span>
    <footer>
        <div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
    </footer>
</li>)
} 

export default Ticket; 