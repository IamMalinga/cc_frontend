import { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";
import {
  NavLink,
  Link,
} from "react-router-dom";

import logo from "../../assets/logo.png";
import "./SiteHeader.scss";


type DropdownKey =
  | "about"
  | "services"
  | "events";

const CLOSE_DELAY_MS = 200;
function DropdownTitle({
  label,
  open,
}: {
  label: string;
  open: boolean;
}) {
  return (
    <span className="dropdown-title">
      {label}
      <svg
        className={`dropdown-caret${open ? " dropdown-caret--open" : ""}`}
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

export default function SiteHeader() {

  const [scrolled, setScrolled] =
    useState(false);
  const [openDropdown, setOpenDropdown] =
    useState<DropdownKey | null>(null);
  const [expanded, setExpanded] =
    useState(false);
  const [isDesktop, setIsDesktop] =
    useState(window.innerWidth >= 992);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 20);

    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
      if(window.innerWidth >= 992){
        setExpanded(false);
      }
    };


    window.addEventListener(
      "scroll",
      handleScroll,
      { passive:true }
    );


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );


      window.removeEventListener(
        "resize",
        handleResize
      );


      clearCloseTimer();

    };

  }, []);




  const handleDropdownEnter =
    (key:DropdownKey)=>{
      if(isDesktop){
        clearCloseTimer();
        setOpenDropdown(key);
      }
    };



  const handleDropdownLeave = ()=>{
    if(isDesktop){
      clearCloseTimer();
      closeTimer.current = setTimeout(()=>{
        setOpenDropdown(null);
      }, CLOSE_DELAY_MS);
    }
  };



  const handleDropdownToggle =
    (
      key:DropdownKey,
      show:boolean
    )=>{
      clearCloseTimer();
      setOpenDropdown(
        show ? key : null
      );

  };



  const closeMobileMenu = ()=>{

    clearCloseTimer();

    setExpanded(false);
    setOpenDropdown(null);

  };




  return (

    <>
      <div className="cc-topbar">

        <Container
          className="
            d-flex
            justify-content-between
            align-items-center
          "
        >
          <div className="cc-topbar-info">
            <span className="cc-topbar-item">

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >

                <path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6Z"/>

                <path d="m22 6-10 7L2 6"/>

              </svg>


              ccoffice@eng.pdn.ac.lk

            </span>



            <span className="cc-topbar-divider"/>



            <span className="cc-topbar-item">


              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >

                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.19 5.15 2 2 0 0 1 5.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>

              </svg>


              +94 81 239 3928


            </span>


          </div>




          <a
            href="https://mail.eng.pdn.ac.lk"
            target="_blank"
            rel="noreferrer"
            className="top-link"
          >

            UOP FOE PDN Mail


            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >

              <path d="M7 17 17 7M7 7h10v10"/>

            </svg>


          </a>



        </Container>


      </div>





      {/* ================= NAVBAR ================= */}


      <Navbar

        expand="lg"

        sticky="top"

        expanded={expanded}

        onToggle={setExpanded}

        className={
          `
          cc-navbar
          ${scrolled
            ? "cc-navbar--scrolled"
            : ""
          }
          `
        }

      >


        <Container>


          <Navbar.Brand
            as={Link}
            to="/"
            className="brand-area"
            onClick={closeMobileMenu}
          >


            <img
              src={logo}
              alt="Computing Centre Logo"
              className="cc-logo"
            />



            <div className="brand-text">


              <div className="title">

                COMPUTING CENTRE

              </div>


              <small>

                University of Peradeniya

              </small>


            </div>


          </Navbar.Brand>





          <Navbar.Toggle
            aria-controls="main-menu"
            aria-label="Toggle navigation"
          />



          <Navbar.Collapse id="main-menu">

            <Nav className="ms-auto align-items-lg-center h6">


              <Nav.Link
                as={NavLink}
                to="/"
                onClick={closeMobileMenu}
              >

                Home

              </Nav.Link>




              {/* ================= ABOUT ================= */}


              <NavDropdown

                title={
                  <DropdownTitle
                    label="About Us"
                    open={openDropdown === "about"}
                  />
                }

                id="about-dropdown"

                show={
                  openDropdown === "about"
                }

                onToggle={
                  (show)=>
                    handleDropdownToggle(
                      "about",
                      show
                    )
                }

                onMouseEnter={
                  ()=>handleDropdownEnter("about")
                }

                onMouseLeave={
                  handleDropdownLeave
                }

              >


                <NavDropdown.Item
                  as={NavLink}
                  to="/news"
                  onClick={closeMobileMenu}
                >
                  News
                </NavDropdown.Item>


                <NavDropdown.Item
                  as={NavLink}
                  to="/history"
                  onClick={closeMobileMenu}
                >
                  History
                </NavDropdown.Item>


                <NavDropdown.Item
                  as={NavLink}
                  to="/directors"
                  onClick={closeMobileMenu}
                >
                  Past Directors
                </NavDropdown.Item>


                <NavDropdown.Item
                  as={NavLink}
                  to="/policy"
                  onClick={closeMobileMenu}
                >
                  Policy and Rules
                </NavDropdown.Item>


                <NavDropdown.Item
                  as={NavLink}
                  to="/labs"
                  onClick={closeMobileMenu}
                >
                  Our Labs
                </NavDropdown.Item>


              </NavDropdown>





              <Nav.Link

                as={NavLink}

                to="/staff"

                onClick={closeMobileMenu}

              >

                Staff

              </Nav.Link>





              <Nav.Link

                as={NavLink}

                to="/vacancies"

                onClick={closeMobileMenu}

              >

                Vacancies

              </Nav.Link>
              <NavDropdown
                title={
                  <DropdownTitle
                    label="Services"
                    open={openDropdown === "services"}
                  />
                }
                id="services-dropdown"
                show={
                  openDropdown === "services"
                }
                onToggle={
                  (show)=>
                    handleDropdownToggle(
                      "services",
                      show
                    )
                }
                onMouseEnter={
                  ()=>handleDropdownEnter(
                    "services"
                  )
                }


                onMouseLeave={
                  handleDropdownLeave
                }

              >



                <NavDropdown.Item

                  as={NavLink}

                  to="/services/lab-reservation"

                  onClick={closeMobileMenu}

                >

                  Lab Reservation

                </NavDropdown.Item>




<NavDropdown.Item
  as="a"
  href="https://feels.pdn.ac.lk/"
  target="_blank"
  rel="noopener noreferrer"
  onClick={closeMobileMenu}
>
  FEeLS
</NavDropdown.Item>




<NavDropdown.Item
  as="a"
  href="https://engold.pdn.ac.lk/coursereg/index.php"
  target="_blank"
  rel="noopener noreferrer"
  onClick={closeMobileMenu}
>
  Course Registration
</NavDropdown.Item>




                <NavDropdown.Item

                  as={NavLink}

                  to="/services/wifi"

                  onClick={closeMobileMenu}

                >

                  Guest Wi-Fi

                </NavDropdown.Item>



              </NavDropdown>
              <NavDropdown

                title={
                  <DropdownTitle
                    label="CC Events"
                    open={openDropdown === "events"}
                  />
                }

                id="events-dropdown"



                show={
                  openDropdown === "events"
                }


                onToggle={
                  (show)=>
                    handleDropdownToggle(
                      "events",
                      show
                    )
                }


                onMouseEnter={
                  ()=>handleDropdownEnter(
                    "events"
                  )
                }


                onMouseLeave={
                  handleDropdownLeave
                }


              >



                <NavDropdown.Item

                  as={NavLink}

                  to="/events/staff"

                  onClick={closeMobileMenu}

                >

                  Staff Events

                </NavDropdown.Item>




                <NavDropdown.Item

                  as={NavLink}

                  to="/events/student"

                  onClick={closeMobileMenu}

                >

                  Student Events

                </NavDropdown.Item>



              </NavDropdown>






              {/* ================= CONTACT ================= */}



              <Nav.Link

                as={NavLink}

                to="/contact"

                className="cc-contact-cta"

                onClick={closeMobileMenu}

              >

                Contact

              </Nav.Link>





            </Nav>


          </Navbar.Collapse>



        </Container>



      </Navbar>



    </>

  );

}