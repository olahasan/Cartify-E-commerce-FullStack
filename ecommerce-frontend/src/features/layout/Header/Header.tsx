import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { CartLogo } from "@cart/index";
import { WishlistLogo } from "@wishlist/index";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Logout } from "@auth/authSlice";
import { persistor } from "@app/store/store";
import { useEffect, useState } from "react";
import { GetCartSummary } from "@cart/cartSlice";
import { GetWishlistByUserID, GetwishlistCount } from "@wishlist/wishlistSlice";
import { GetSuggestionsThunk } from "@search/SearchSlice";

import styles from "./Header.module.css";
const {
  headerTopPart,
  logo,
  imgs,
  header,
  searchContainer,
  suggestionsDropdown,
  suggestionItem,
  betweenIcons,
} = styles;
const Header = () => {
  const dispatch = useAppDispatch();
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const { wishlistCount } = useAppSelector((state) => state.wishlist);
  const { Suggestions } = useAppSelector((state) => state.search);
  const token = LoginReturn?.token;

  const handleLogout = () => {
    dispatch(Logout());
    persistor.purge();
  };

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/search?searchTerm=${searchText}`);
    setSearchText("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(GetCartSummary());
      dispatch(GetwishlistCount());
      dispatch(GetWishlistByUserID());
    }
  }, [token, dispatch]);

  //debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText.trim()) {
        dispatch(GetSuggestionsThunk(searchText));
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText, dispatch]);

  return (
    <header>
      <div className={headerTopPart}>
        <h1>
          <Link to="/" className={logo}>
            Cartify
          </Link>
        </h1>
        <div className={imgs}>
          <WishlistLogo totalQuantity={wishlistCount} />
          <div className={betweenIcons}></div>
          <CartLogo />
        </div>
      </div>

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className={header}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="categories">
                Categories
              </Nav.Link>
              <div className={searchContainer}>
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => {
                      setShowSuggestions(false);
                    }, 200)
                  }
                />

                {showSuggestions && Suggestions?.length > 0 && (
                  <div className={suggestionsDropdown}>
                    {Suggestions.map((item) => (
                      <div
                        key={item.suggestionText}
                        className={suggestionItem}
                        onClick={() => {
                          setSearchText(item.suggestionText);
                          setShowSuggestions(false);

                          navigate(`/search?searchTerm=${item.suggestionText}`);
                        }}
                      >
                        {item.suggestionText}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Nav>
            {!LoginReturn?.token ? (
              <>
                <Nav>
                  <Nav.Link as={NavLink} to="login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="register">
                    Register
                  </Nav.Link>
                </Nav>
              </>
            ) : (
              <NavDropdown
                title={`Welcome: ${LoginReturn?.firstName} ${LoginReturn?.lastName}`}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={NavLink} to="profile">
                  profile
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="profile/Orders">
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/" onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
