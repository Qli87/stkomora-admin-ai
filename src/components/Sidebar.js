import React from 'react'
import {NavLink} from 'react-router-dom'

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMenuItem: ''
        }
    }

    activateMenuItem = (menuItemName) => {
        this.setState({
            activeMenuItem: menuItemName
        })
    }


    render(){
        return (
            <aside className="main-sidebar" style={{'minHeight':'200vh'}}>
                <section className="sidebar">
                {/* <div className="user-panel "> */}
                    {/* <div className="pull-left image"> */}
                    {/* <img src="dist/img/logo.png" className="img-circle" alt="User" /> */}
                    {/* <img src="/public/dist/img" className="img-circle" alt="User" /> */}
                    {/* </div> */}
                    {/* <div className="pull-left info"> */}
                    {/* <p>Administracija</p> */}
                    {/* <a href=""><i className="fa fa-circle text-success"></i>Online</a> */}
                    {/* </div> */}
                {/* </div> */}
                {/* <form action="#1" method="get" className="sidebar-form">
                    <div className="input-group">
                    <input type="text" name="q" className="form-control" placeholder="Search..." />
                    <span className="input-group-btn">
                            <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
                            </button>
                        </span>
                    </div>
                </form> */}
                    <ul className="sidebar-menu" data-widget="tree">
                        {/* <li className={`treeview ${this.state.activeMenuItem === 'pocetna' ? 'active' : ''}`}>
                            <NavLink to="#1"  onClick={() => this.activateMenuItem('pocetna')}>
                                <i className="fa fa-dashboard"></i> <span>Početna</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to="/pocetna"><i className="fa fa-circle-o"></i> Podaci o stranici</NavLink></li>
                            </ul>
                        </li> */}
                        {/* <li className={`treeview ${this.state.activeMenuItem === 'onama' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('onama')}>
                                <i className="fa fa-user-circle"></i> <span>O nama</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li><NavLink to='/onama'><i className="fa fa-circle-o"></i> Podaci o stranici</NavLink></li>
                            </ul>
                        </li> */}
                        <li className={`treeview ${this.state.activeMenuItem === 'clanovi_komore' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('clanovi_komore')}>
                                <i className="fa fa-user-o"></i> <span>Članovi komore</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li><NavLink to="/spisakClanova"><i className="fa fa-circle-o"></i> Spisak članova</NavLink></li>
                                <li><NavLink to="/dodajClana"><i className="fa fa-circle-o"></i> Dodaj člana</NavLink></li>
                            </ul>
                        </li>

                        {/* <li className={`treeview ${this.state.activeMenuItem === 'clanovi_izvrsnog_odbora' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('clanovi_izvrsnog_odbora')}>
                                <i className="fa fa-user"></i><span>Članovi izvršnog odbora</span>
                                    <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to="/clanoviOdbora"><i className="fa fa-circle-o"></i> Spisak članova</NavLink></li>
                            </ul>
                        </li> */}

                        {/* <li className={`treeview ${this.state.activeMenuItem === 'clanovi_skupstine' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('clanovi_skupstine')}>
                                <i className="fa fa-user-circle"></i> <span>Članovi skupštine</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li><NavLink to="/clanoviSkupstinePg" ><i className="fa fa-circle-o"></i> Podgorica</NavLink></li>
                                <li><NavLink to="/clanoviSkupstineCt" ><i className="fa fa-circle-o"></i> Cetinje</NavLink></li>
                                <li><NavLink to="/clanoviSkupstineNk" ><i className="fa fa-circle-o"></i> Nikšić</NavLink></li>
                                <li><NavLink to="/clanoviSkupstineSjever" ><i className="fa fa-circle-o"></i> Sjever</NavLink></li>
                                <li><NavLink to="/clanoviSkupstineJug" ><i className="fa fa-circle-o"></i> Jug</NavLink></li>
                            </ul>
                        </li> */}
                        <li className={`treeview ${this.state.activeMenuItem === 'vijesti' ? 'active' : ''}`}>
                            {/* <a href="#1" onClick={() => this.activateMenuItem('vijesti')}> */}
                            <NavLink to="#1" onClick={() => this.activateMenuItem('vijesti')}>
                                <i className="fa fa-user-circle"></i> <span>Vijesti</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to='/vijesti'><i className="fa fa-circle-o"></i> Pregled vijesti</NavLink></li>
                                {/* <li><a href="dodajVijest"><i className="fa fa-circle-o"></i> Dodaj vijest</a></li> */}
                                <li><NavLink to='/dodajVijest'><i className="fa fa-circle-o"></i> Dodaj vijest</NavLink></li>
                            </ul>
                        </li>
                        {/* <li className={`treeview ${this.state.activeMenuItem === 'okomori' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('okomori')}>
                                <i className="fa fa-user-circle"></i> <span>O komori</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to='/organi_komore'><i className="fa fa-circle-o"></i> Organi komore</NavLink></li>
                                <li><NavLink to='/pristup_informacijama'><i className="fa fa-circle-o"></i> Slobodan pristup info.</NavLink></li>
                                <li><NavLink to='/dodaj_o_komori'><i className="fa fa-circle-o"></i> Dodaj forma</NavLink></li>
                            </ul>
                        </li> */}
                        <li className={`treeview ${this.state.activeMenuItem === 'oglasi' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('oglasi')}>
                                <i className="fa fa-user-circle"></i> <span>Oglasi</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to="/oglasi"><i className="fa fa-circle-o"></i> Pregled oglasa</NavLink></li>
                                <li><NavLink to="/dodajOglas"><i className="fa fa-circle-o"></i> Dodaj oglas</NavLink></li>
                            </ul>
                        </li>
                        {/* <li className={`treeview ${this.state.activeMenuItem === 'kontakt' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('kontakt')}>
                                <i className="fa fa-user-circle"></i> <span>Kontakt</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to="/kontakt"><i className="fa fa-circle-o"></i> Podaci o firmi</NavLink></li>
                            </ul>
                        </li> */}

                        <li className={`treeview ${this.state.activeMenuItem === 'kongres' ? 'active' : ''}`}>
                            <NavLink to="#1" onClick={() => this.activateMenuItem('kongres')}>
                                <i className="fa fa-user-circle"></i> <span>Kongres</span>
                                <span className="pull-right-container">
                                <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </NavLink>
                            <ul className="treeview-menu">
                                <li className="active"><NavLink to="/kongres"><i className="fa fa-circle-o"></i> Prijave</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}