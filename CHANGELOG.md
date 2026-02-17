## v1.0.5 (2026-02-17)

### Refactor

- adjust adapters clerk stuff
- map new backend totals to its fields

## v1.0.3 (2026-02-13)

### Refactor

- adjust totals
- add currentpage title and subtitle to main header
- add a layout system
- improve prodform layout
- improve prodform layout
- normalize loading
- translated things to ptbr
- add loading state to createShoppingEvent
- add loading spinner and disable buttons on cart product adding
- rename and reorganize stuff
- use buttonGroup on market listItem

## v1.0.1 (2026-02-01)

### Refactor

- fix typescript errors
- add padding to family creation
- remove extra amount field in add product form

## v1.0.0 (2025-06-24)

### Feat

- add loading animation for isSignedIn verification
- add clerk to landing page
- add landingPage
- add Dockerfile for nginx config
- add loggedUser component to drawer
- add getInitials function for Avatar fallback
- add removeFamilyMember view component
- add removeFamilyMember infra layer
- add a working family details screen
- ensure onboarding are shown when no family and vice versa
- add joinFamily functionality
- add createFamily functionality
- add createFamilyForm wip
- add createFamily infra layer wip
- add onboarding sheet component
- add base family onboarding component | move family onboarding route inside family
- ensure user gets redirected to family onboarding if userNotAFamilyMember error
- add the hability to end shopping event
- add the hability to end shopping event
- add the hability to remove products from cart
- add RemoveProductFromCart query mutation layer
- add RemoveProductFromCart api layer
- add the hability to update products in cart
- add UpdateProductInCart query mutation
- add UpdateProductInCart api layer
- add the hability to add products to cart
- add AddProductToCart mutation layer
- add AddProductToCart api layer
- add ongoing shoppingEventPage wip
- add getShoppingEventById infra layer
- add base ongoingShoppingEvent route
- turn pagination into a ui component | add shopping event list wip
- add getShoppingEventList infra layer
- add base shopping event route/page
- add updateMarket functionality
- add new market form wip
- add new Market page wip
- add a paginated market list
- add market infra
- add breadcrumbs
- add public routes

### Refactor

- change variable name to upper
- remove next use-client
- add start shoppingEvent to shoppingEventList
- recalculate on product removal
- fix authorization flow
- signout user on error
- use clerk signout on error
- made some adjustments in the family details page
- ensure cookies are sent to the backend through axios
- remove google env variables
- remove google auth from the project
- replace user info with clerk data on side navigation
- move shopping event items to shopping event feature
- adjust all market items into market feature
- adjust all family items into family feature
- adjust features/authentication layer
- move main content to its place
- fix monetary fields
- remove unused console.log
- ensure copy to clipboard works on mobile as well
- move is a familyMember validation to query
- add refresh button to cart
- comment the refresh invite code button untill it gets implemented
- copy code to clipboard history
- ensure remove button appears only on normal members
- add confirmation modal for family member removal
- display family details
- ensure description are also saved on family creation
- ensure family description are also sent in family creation
- remove slash from api routes so the baseurl can be used
- fix some issues needed for dockering
- organize folders and names
- small adjustments
- small adjustments
- update error messages
- remove console.log everywhere
- remove extra spacing in hamburger menu
- try another token setup
- small adjustments
- add base product-form ui
- add a new block of firebase to test the token refresh
- move each section to its own file
- fix spacings
- add products list to ongoing details wip
- add fields to ongoing shopping event details wip
- navigate user to ongoing shopping event on event start
- add start shopping event functionality
- organize folder structure
- add new shoppingEvent button
- remove details button
- fix currency format
- add money format
- add datetime formatting
- add grid wrapper to the shopping event list
- remove delete button from market items
- add update Market wip
- add update market functionality wip
- finished add new Market
- finished add new Market
- add newMarket functionality wip
- fix breadcrumbs
- change arrow for icons | display pagination separately
- ensure menu closes on item click | ensure titles are display dinamicaly
- separated pages from routes
- create a base nav bar
- add key files to eslint ignor
- modify drawer to display from the sides
- settle at the first version of login page
- an idea of a login page is emerging
- add routes in react-router-dom format
- remove tanstack router
- ensure to display only the Outlet if no user authenticated
- replace useState by useReducer in FirebaseProvider
- ensure routes are enabled or disabled by authentication status
- rename variable
- add tokens to Firebase Provider
- remove google auth
- add login with google examples (poc)
- remove testing code
- rename base files
