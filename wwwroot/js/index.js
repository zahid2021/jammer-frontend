const userIconContainer = document.querySelector("#account-icons");
const userIcon = document.querySelector("#user-icon");

const token = Cookies.get('Token');
if (token === undefined || token === null) {
    userIconContainer.style.display = "none";
} else {
    userIconContainer.style.display = "flex"; 
    userIcon.style.display = "none";
}



document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchPopup = document.getElementById('search-popup');
    const searchInputMobile = document.getElementById('search-input-mobile');
    const searchButtonMobile = document.getElementById('search-button-mobile');
    const searchPopupMobile = document.getElementById('search-popup-mobile');

    async function searchProducts(query, isMobile = false) {
        try {
            const response = await fetch(`https://jammerapi.mahmadamin.com/api/Product/SearchProductsByName?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (isMobile) {
                displaySearchResults(data.data, searchPopupMobile,true);
            } else {
                displaySearchResults(data.data, searchPopup);
            }
        } catch (error) {
            showPopup('Error fetching search results:', false);
        }
    }

    function displaySearchResults(products, popupElement, isMobile = false) {
        popupElement.innerHTML = '';
        popupElement.classList.remove('hidden');

        const limitedProducts = products.slice(0, 5);

        popupElement.classList.add(
            'absolute',
            'top-14',
            'bg-white',
            'border',
            'border-gray-300',
            'z-50',
            'p-4',
            'shadow-lg',
            isMobile ? 'right-6' : 'left-8'
        );

        limitedProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('flex', 'items-center', 'justify-between', 'mb-4','gap-2');

            const img = document.createElement('img');
            img.src = `https://jammerapi.mahmadamin.com${product.imagePath[0]}`;
            img.alt = product.name;
            img.classList.add('w-12', 'h-12', 'object-cover', 'mr-4');

            const productName = document.createElement('p');
            productName.textContent = product.name;
            productName.classList.add('flex-1');

            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.textContent = 'View';
            viewMoreBtn.classList.add('text-blue', 'ml-4');
            viewMoreBtn.addEventListener('click', () => {
                window.location.href = `/Home/Product?productUrl=${product.productURL}`;
            });

            productDiv.appendChild(img);
            productDiv.appendChild(productName);
            productDiv.appendChild(viewMoreBtn);

            popupElement.appendChild(productDiv);
        });

        const viewAllBtn = document.createElement('button');
        viewAllBtn.textContent = 'View All';
        viewAllBtn.classList.add('text-blue-500', 'button-main', 'mt-4', 'w-full');
        viewAllBtn.addEventListener('click', () => {
            const searchQuery = popupElement === searchPopupMobile ? searchInputMobile.value.trim() : searchInput.value.trim();
            window.location.href = `/Home/Search?query=${encodeURIComponent(searchQuery)}`;
        });

        popupElement.appendChild(viewAllBtn);
    }

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchProducts(query);
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
            }
        }
    });

    searchButtonMobile.addEventListener('click', () => {
        const query = searchInputMobile.value.trim();
        if (query) {
            searchProducts(query, true);
        }
    });

    searchInputMobile.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInputMobile.value.trim();
            if (query) {
                searchProducts(query, true);
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchPopup.contains(event.target) && !searchButton.contains(event.target) && !searchInput.contains(event.target)) {
            searchPopup.classList.add('hidden');
        }
        if (!searchPopupMobile.contains(event.target) && !searchButtonMobile.contains(event.target) && !searchInputMobile.contains(event.target)) {
            searchPopupMobile.classList.add('hidden');
        }
    });
});





async function fetchProducts() {
    try {
        const token = Cookies.get('Token');

        const response = await fetch(`https://jammerapi.mahmadamin.com/api/Product/GetProductsWithPaging?pageNumber=${1}&pageSize=${10}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data && data.data) {
                const productList = data.data;
                products = productList.slice(0, 10)
                fetchRecommendedProducts(products);
                const productsContainer = document.getElementById('products-container');

                productsContainer.innerHTML = ''; 

                products.forEach(product => {
                    const productLink = document.createElement('a');
                    productLink.href = `/Home/Product?productUrl=${product.productURL}`;  
                    productLink.className = 'block'; 

                    const productCard = document.createElement('div');
                    productCard.className = 'product-item style-marketplace p-4 border border-line rounded-2xl flex flex-col justify-between';

                    const bgImgDiv = document.createElement('div');
                    bgImgDiv.className = 'bg-img relative w-full aspect-1/1 flex justify-center';

                    const productImg = document.createElement('img');
                    productImg.className = " object-cover";
                    productImg.src = `https://jammerapi.mahmadamin.com${product.imagePath}`;
                    productImg.alt = product.productName;
                    productImg.style.height = "200px";
                    bgImgDiv.appendChild(productImg);

                    const listActionDiv = document.createElement('div');
                    listActionDiv.className = 'list-action flex flex-col gap-1 absolute top-0 right-0';

                    const actionButtons = [
                        { class: 'add-wishlist-btn', iconClass: 'ph-heart', action: (e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(product.id, 1, product.couponId); } },
                        { class: 'quick-view-btn', iconClass: 'ph-eye' },
                        { class: 'add-cart-btn', iconClass: 'ph-shopping-bag-open', action: (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id, 1, product.couponId); } }
                    ];

                    actionButtons.forEach(action => {
                        const span = document.createElement('span');
                        span.className = `${action.class} w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300`;
                        const icon = document.createElement('i');
                        icon.className = `ph ${action.iconClass}`;
                        span.appendChild(icon);

                        if (action.action) {
                            span.addEventListener('click', action.action);
                        }

                        listActionDiv.appendChild(span);
                    });

                    bgImgDiv.appendChild(listActionDiv);
                    productCard.appendChild(bgImgDiv);

                    const productInfoDiv = document.createElement('div');
                    productInfoDiv.className = 'product-infor mt-4 flex flex-col justify-between flex-grow';

                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'text-title';
                    titleSpan.textContent = product.name;

                    const starDiv = document.createElement('div');
                    starDiv.className = 'flex gap-0.5 mt-1';
                    for (let i = 0; i < 5; i++) {
                        const starIcon = document.createElement('i');
                        starIcon.className = 'ph-fill ph-star text-sm text-yellow';
                        starDiv.appendChild(starIcon);
                    }

                    const priceSpan = document.createElement('span');
                    priceSpan.className = 'text-title inline-block mt-1';
                    priceSpan.textContent = `PKR ${product.price.toFixed(2)}`;




                    productInfoDiv.appendChild(titleSpan);
                    productInfoDiv.appendChild(starDiv);
                    productInfoDiv.appendChild(priceSpan);


                    productCard.appendChild(productInfoDiv);

                    productLink.appendChild(productCard);

                    productsContainer.appendChild(productLink);
                });
            } else {
                showPopup('No products found.', false)

            }
        } else {
            const errorText = await response.text();
            showPopup('Error fetching products:', false)

        }
    } catch (error) {
        showPopup('Error fetching products:', false)

    }
}
 



function showPopup(message, success = true) {
        const popup = document.getElementById('popup-message');
    popup.style.top = "15%";
    popup.style.right = "1%";
        popup.style.zIndex = "500";

        popup.textContent = message;
        popup.classList.remove('hidden', 'bg-red', 'bg-green');
        popup.classList.add(success ? 'bg-green' : 'bg-red');

        setTimeout(() => {
            popup.classList.add('hidden');
        }, 3000);
    }

async function addToWishlist(productId, quantity = 1, couponId) {
        try {
            const token = Cookies.get('Token');
            let obj = {
                productId: productId,
                quantity: quantity,
                couponId: couponId
            }

            const response = await fetch('https://jammerapi.mahmadamin.com/api/WishList/AddWishList', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });

            if (response.ok) {
                const result = await response.json();
                showPopup('Product added to wishlist');
            } else {
                const errorText = await response.text();
                showPopup('Product already add in wishlist', false);
            }
        } catch (error) {
            showPopup('Error adding product to wishlist', false);
        }
    }

async function addToCart(productId, quantity = 1, couponId ) {
        try {
            const token = Cookies.get('Token');
            let obj = {
                productId: productId,
                quantity: quantity,
                couponId: couponId
            }

            const response = await fetch('https://jammerapi.mahmadamin.com/api/Cart/AddToCart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });

            if (response.ok) {
                const result = await response.json();
                showPopup('Product added to cart');
            } else {
                const errorText = await response.text();
                showPopup('Product already add in cart', false);
            }
        } catch (error) {
            showPopup('Error adding product to cart', false);
        }
    }


document.addEventListener('DOMContentLoaded', () => fetchProducts());





async function fetchBanner() {
    try {
        const response = await fetch('https://jammerapi.mahmadamin.com/api/Banner/GetAllBanners',{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
});
        const data = await response.json();
        const banners = data.data;

        if (banners && banners.length > 0) {
            const swiperWrapper = document.querySelector('.swiper-wrapper');
            swiperWrapper.innerHTML = ''; 

            banners.forEach(banner => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');

                const bannerLink = document.createElement('a');

                if (banner.link === 1) {
                    async function getProduct() {
                        const response = await fetch(`https://jammerapi.mahmadamin.com/api/Product/GetProductById?productId=${banner.linkId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
});
                        const data = await response.json();
                        const product = data.data;
                        bannerLink.href = `/Home/Product?productUrl=${product.productURL}`;
                    };
                    getProduct()
                } else if (banner.link === 2) {
                    bannerLink.href = `/Home/Category?categoryId=${banner.linkId}`;
                }

                bannerLink.classList.add('block');

                const bannerImg = document.createElement('img');
                bannerImg.src = `https://jammerapi.mahmadamin.com${banner.image}`;
                bannerImg.alt = 'Banner';
                bannerImg.classList.add('w-full', 'h-auto', 'object-cover');

                bannerLink.appendChild(bannerImg);
                slide.appendChild(bannerLink);

                swiperWrapper.appendChild(slide);
            });

            const swiper = new Swiper('.swiper', {
                loop: true,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                slidesPerView: 1,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });

        } else {
            showPopup('No banners found.',  false)
        }

    } catch (error) {
        showPopup('Error fetching banners:', false)

    }
}

document.addEventListener('DOMContentLoaded', fetchBanner);











function categoryPage(id) {
    window.location.href = `/Home/Category?categoryId=${id}`

}

//Fetch Category Data From Api
async function fetchCategories() {
    try {
        const response = await fetch('https://jammerapi.mahmadamin.com/api/Category/GetAllCategories');
        const data = await response.json();
        const categories = data.data;
        displayCategories(categories)


        if (data && data.data) {



            for (let i = 0; i < 3; i++) {
                const category = categories[i];
                const img = document.getElementById(`category-img-${i + 1}`);
                const title = document.getElementById(`category-name-${i + 1}`);
                const shopBtn = document.getElementById(`shop-btn-${i + 1}`);
                img.className = ' object-cover';
                img.style.height = "200px";
                img.src = `https://jammerapi.mahmadamin.com${category.imagePath}`;
                title.textContent = category.name;
                shopBtn.textContent = `Shop ${category.name}`;
            }




            //Display Categories in Our Collection Section

            const parentCategories = {};
            const childCategories = {};
            categories.forEach(category => {
                if (category.parentId === null) {
                    parentCategories[category.id] = {
                        ...category,
                        children: []
                    };
                } else {
                    if (!childCategories[category.parentId]) {
                        childCategories[category.parentId] = [];
                    }
                    childCategories[category.parentId].push(category);
                }
            });
            Object.keys(childCategories).forEach(parentId => {
                if (parentCategories[parentId]) {
                    parentCategories[parentId].children = childCategories[parentId];
                }
            });

            const cardElements = [
                document.getElementById('category-card-1'),
                document.getElementById('category-card-2'),
                document.getElementById('category-card-3'),
                document.getElementById('category-card-4'),

            ];

            let cardIndex = 0;
            Object.values(parentCategories).forEach(parentCategory => {
                if (cardIndex < cardElements.length) {
                    const card = cardElements[cardIndex];
                    cardIndex++;

                    card.innerHTML = '';

                    const imageLink = document.createElement('a');
                    imageLink.href = '';
                    imageLink.className = 'w-[100px] h-[100px] flex-shrink-0';

                    const image = document.createElement('img');
                    image.src = `https://jammerapi.mahmadamin.com${parentCategory.imagePath}`;
                    image.alt = parentCategory.name;
                    image.className = ' object-cover';
                    image.style.height = '100px'; 

                    imageLink.appendChild(image);

                    const textContentDiv = document.createElement('div');
                    textContentDiv.className = 'text-content w-full';

                    const headingDiv = document.createElement('div');
                    headingDiv.className = 'heading6 pb-4';
                    headingDiv.textContent = parentCategory.name;

                    const ul = document.createElement('ul');

                    parentCategory.children.forEach(child => {
                        const li = document.createElement('li');
                        li.className = 'mt-1';

                        const childLink = document.createElement('a');
                        childLink.href = '';
                        childLink.id = `category-parent-1-child-${child.id}`;
                        childLink.className = 'has-line-before caption1 text-secondary hover:text-black';
                        childLink.textContent = child.name;

                        childLink.onclick = () => {
                            categoryPage(child.id); 
                            return false;
                        };

                        li.appendChild(childLink);
                        ul.appendChild(li);
                    });

                    const allProductsLink = document.createElement('a');
                    allProductsLink.href = '';
                    allProductsLink.className = 'flex items-center gap-1.5 mt-4';

                    const allProductsSpan = document.createElement('span');
                    allProductsSpan.className = 'text-button';
                    allProductsSpan.id = 'category-parent-1-btn';
                    allProductsSpan.textContent = 'All Products';

                    const allProductsIcon = document.createElement('i');
                    allProductsIcon.className = 'ph-bold ph-caret-double-right text-sm';

                    allProductsLink.appendChild(allProductsSpan);
                    allProductsLink.appendChild(allProductsIcon);

                    textContentDiv.appendChild(headingDiv);
                    textContentDiv.appendChild(ul);
                    textContentDiv.appendChild(allProductsLink);

                    card.appendChild(imageLink);
                    card.appendChild(textContentDiv);
                }
            });


            while (cardIndex < cardElements.length) {
                cardElements[cardIndex].style.display = 'none';
                cardIndex++;
            }




            //Display Categories in Our Best Selling Section Buttons


            fetchCategories(categories);
            function fetchCategories(categories) {

                const menuTab = document.querySelector('.menu');

                categories.forEach(category => {
                    const button = document.createElement('div');
                    button.classList.add('tab-item', 'relative', 'text-secondary', 'text-button-uppercase', 'py-2', 'px-5', 'cursor-pointer', 'duration-300', 'hover:text-black');
                    button.innerText = category.name;
                    button.addEventListener('click', () => fetchProductsByParentId(category.id));

                    menuTab.appendChild(button);
                });
            }





            //Display Categories in Best Selling Section


            fetchCategoriesAndCoupons(categories)
            function fetchCategoriesAndCoupons(categories) {

                        for (let i = 0; i < 2; i++) {
                            const category = categories[i];

                            document.getElementById(`category-title-${i + 1}`).innerHTML = `${category.name}`;

                            const imgElement = document.querySelector(`#category-banner-${i + 1} .banner-img img`);
                            imgElement.src = `https://jammerapi.mahmadamin.com${category.imagePath}`;
                            imgElement.alt = `${category.name}`;


                            const discount = category.discount ? `Save ${category.discount}%` : 'No Discount';
                            document.getElementById(`category-discount-${i + 1}`).textContent = discount;
                        }               
            }


        } else {
            showPopup('No categories found.');

        }

    } catch (error) {
        showPopup('Error fetching categories:',false);

    }

}

document.addEventListener('DOMContentLoaded', fetchCategories);


// Function to display categories dynamically (limited to 8 categories)
function displayCategories(categories) {
    const categoryContainer = document.querySelector('.sub-menu-department');
    categoryContainer.innerHTML = ''; 

    const limitedCategories = categories.slice(0, 8);

    limitedCategories.forEach(category => {
        const categoryLink = document.createElement('a');
        categoryLink.href = `/Home/Category?categoryId=${category.id}`;
        categoryLink.className = 'item py-3 whitespace-nowrap border-b border-line w-full flex items-center justify-between';

        const categorySpan = document.createElement('span');
        categorySpan.className = 'flex items-center gap-2';

        const categoryIcon = document.createElement('i');
        categoryIcon.className = 'ph-bold ph-desktop-tower text-lg';

        const categoryName = document.createElement('span');
        categoryName.className = ''; 
        categoryName.textContent = category.name; 

        categorySpan.appendChild(categoryIcon);
        categorySpan.appendChild(categoryName);

        categoryLink.appendChild(categorySpan);

        const caretIcon = document.createElement('i');
        caretIcon.className = 'ph-bold ph-caret-right';
        categoryLink.appendChild(caretIcon);

        categoryContainer.appendChild(categoryLink);
    });
}




document.addEventListener('DOMContentLoaded', function () { fetchProductsByParentId(57) });






// Fetch and display products by parent category ID
async function fetchProductsByParentId(parentId) {
    try {
        const token = Cookies.get('Token');

        const response = await fetch(`https://jammerapi.mahmadamin.com/api/Product/FilterProductsByCategory/${parentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();

        if (result.data) {
            const products = result.data;
            const productList = document.querySelector('#list-product');
            productList.classList.remove('hide-product-solid-grid');
            productList.innerHTML = ''; 

            products.forEach(product => {
                const productLink = document.createElement('a');
                productLink.href = `/Home/Product?productUrl=${product.productURL}`; 
                productLink.className = 'block'; 

                const productItem = document.createElement('div');
                productItem.classList.add('product-item','relative', 'style-marketplace-list', 'flex', 'items-center', 'gap-2', 'bg-white', 'py-5', 'px-[39px]', 'rounded');

                const imgContainer = document.createElement('div');
                imgContainer.classList.add('bg-img', 'lg:w-[150px]', 'w-[120px]', 'flex-shrink-0', 'aspect-1/1');

                const productImage = document.createElement('img');
                productImage.classList.add( 'object-cover');
                productImage.src = `https://jammerapi.mahmadamin.com${product.imagePath[0]}`;
                productImage.style.height = "150px";
                productImage.alt = product.name;

                const listActionDiv = document.createElement('div');
                listActionDiv.className = 'list-action flex flex-col gap-1 absolute top-0 right-0';
                const actionButtons = [
                    { class: 'add-wishlist-btn', iconClass: 'ph-heart', action: (e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(product.id, 1, 0); } },
                    { class: 'quick-view-btn', iconClass: 'ph-eye' },
                    { class: 'add-cart-btn', iconClass: 'ph-shopping-bag-open', action: (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id, 1, 0); } }
                ];

                actionButtons.forEach(action => {
                    const span = document.createElement('span');
                    span.className = `${action.class} w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300`;
                    const icon = document.createElement('i');
                    icon.className = `ph ${action.iconClass}`;
                    span.appendChild(icon);

                    if (action.action) {
                        span.addEventListener('click', action.action);
                    }

                    listActionDiv.appendChild(span);
                });

                imgContainer.appendChild(productImage);
                imgContainer.appendChild(listActionDiv); 

                const productInfo = document.createElement('div');
                productInfo.classList.add('product-infor');

                const productName = document.createElement('span');
                productName.classList.add( 'uppercase', 'block','text-title');
                productName.textContent = product.name;

                const productDescription = document.createElement('span');
                productDescription.classList.add('caption2', 'mt-2');
                const shortDescription = product.description.split(' ').slice(0, 4).join(' ') + '...';
                productDescription.textContent = shortDescription;


                const ratingContainer = document.createElement('div');
                ratingContainer.classList.add('flex', 'gap-0.5', 'mt-2');

                for (let i = 0; i < 5; i++) {
                    const starIcon = document.createElement('i');
                    starIcon.classList.add('ph-fill', 'ph-star', 'text-sm', 'text-yellow');
                    ratingContainer.appendChild(starIcon);
                }

                const priceContainer = document.createElement('div');
                priceContainer.classList.add('flex', 'items-center', 'gap-3', 'mt-3');

                const priceElement = document.createElement('span');
                priceElement.classList.add('text-title', 'inline-block');
                priceElement.textContent = `PKR ${product.price}`;

                priceContainer.appendChild(priceElement);

                productInfo.appendChild(productName);
                productInfo.appendChild(productDescription);
                productInfo.appendChild(ratingContainer);
                productInfo.appendChild(priceContainer);

                productItem.appendChild(imgContainer);
                productItem.appendChild(productInfo);

                productList.appendChild(productItem);
                productList.appendChild(productLink);
            });

        }
    } catch (error) {
        showPopup("Error fetching products:", false)

    }
}




// Fetch and display TopRatedProducts Section

async function fetchTopRatedProducts() {

    const token = Cookies.get('Token'); 

    try {
        const response = await fetch(`https://jammerapi.mahmadamin.com/api/Product/GetProductsWithPaging?pageNumber=${1}&pageSize=${10}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data && data.data) {
            displayTopRatedProducts(data.data);
        } else {
            showPopup('No products found');

        }
    } catch (error) {
        showPopup('Error fetching top-rated products:',false);

    }
}

function displayTopRatedProducts(products) {
    const productContainer = document.querySelector('#list');

    productContainer.innerHTML = '';  
    const limitedProducts = products.slice(0, 6); 

    limitedProducts.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = `/Home/Product?productUrl=${product.productURL}`; 
        productLink.className = 'block'; 

        const productItem = document.createElement('div');
        productItem.classList.add('product-item', 'style-marketplace-list', 'flex', 'items-center', 'gap-2', 'bg-white', 'py-5', 'px-[39px]', 'rounded', 'relative'); 

        const bgImgDiv = document.createElement('div');
        bgImgDiv.classList.add('bg-img', 'lg:w-[150px]', 'w-[120px]', 'flex-shrink-0', 'aspect-1/1');

        const imgElement = document.createElement('img');
        imgElement.classList.add('object-cover');
        imgElement.src = `https://jammerapi.mahmadamin.com${product.imagePath[0]}`;
        imgElement.style.height = "150px";
        imgElement.alt = product.name;

        bgImgDiv.appendChild(imgElement);

        const listActionDiv = document.createElement('div');
        listActionDiv.className = 'list-action flex flex-col gap-1 absolute top-2 right-2'; 

        const actionButtons = [
            { class: 'add-wishlist-btn', iconClass: 'ph-heart', action: (e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(product.id, 1, product.couponId); } },
            { class: 'quick-view-btn', iconClass: 'ph-eye' },
            { class: 'add-cart-btn', iconClass: 'ph-shopping-bag-open', action: (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id, 1, product.couponId); } }
        ];

        actionButtons.forEach(action => {
            const span = document.createElement('span');
            span.className = `${action.class} w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300`;
            const icon = document.createElement('i');
            icon.className = `ph ${action.iconClass}`;
            span.appendChild(icon);

            if (action.action) {
                span.addEventListener('click', action.action);
            }

            listActionDiv.appendChild(span);
        });

        listActionDiv.style.opacity = '0';
        listActionDiv.style.transform = 'translateY(10px)';
        listActionDiv.style.transition = 'opacity 0.3s, transform 0.3s';

        bgImgDiv.appendChild(listActionDiv);

        productItem.appendChild(bgImgDiv);

        productItem.addEventListener('mouseover', () => {
            listActionDiv.style.opacity = '1';
            listActionDiv.style.transform = 'translateY(0)';
        });

        productItem.addEventListener('mouseout', () => {
            listActionDiv.style.opacity = '0';
            listActionDiv.style.transform = 'translateY(10px)';
        });

        const productInfoDiv = document.createElement('div');
        productInfoDiv.classList.add('product-infor');

        const brandElement = document.createElement('span');
        brandElement.classList.add( 'uppercase', 'block','text-title');
        brandElement.textContent = product.name;

        const productDescription = document.createElement('p');
        productDescription.classList.add('caption2', 'mt-2');
        const shortDescription = product.description.split(' ').slice(0, 4).join(' ') + '...';
        productDescription.textContent = shortDescription;

        const priceElement = document.createElement('span');
        priceElement.classList.add('text-title', 'inline-block');
        priceElement.textContent = `PKR ${product.price}`;

      

        productInfoDiv.appendChild(brandElement);
        productInfoDiv.appendChild(productDescription);
        productInfoDiv.appendChild(priceElement);

        productItem.appendChild(productInfoDiv);

        productLink.appendChild(productItem);

        productContainer.appendChild(productLink);

    });

}

document.addEventListener('DOMContentLoaded', fetchTopRatedProducts);










// Function to Display Data in Recommendetion Section
async function fetchRecommendedProducts(products) {
    console.log(products)
    const productList = document.querySelector('#recommended-product-con'); 

    productList.innerHTML = '';

    products.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = `/Home/Product?productUrl=${product.productURL}`; 
        productLink.className = 'block'; 

        const productItem = document.createElement('div');
        productItem.classList.add('product-item', 'style-marketplace', 'p-4', 'border', 'border-line', 'rounded-2xl', 'relative');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('bg-img', 'relative', 'w-full', 'aspect-1/1', 'flex', 'justify-center');

        const productImage = document.createElement('img');
        productImage.src = `https://jammerapi.mahmadamin.com${product.imagePath}`; 
        productImage.style.height = "150px";
        productImage.alt = product.name;

        imgContainer.appendChild(productImage);

        const listActionDiv = document.createElement('div');
        listActionDiv.className = 'list-action absolute top-2 right-2 opacity-0 transition-opacity duration-300'; 

        const actionButtons = [
            { class: 'add-wishlist-btn', iconClass: 'ph-heart', action: (e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(product.id, 1, 0); } },
            { class: 'quick-view-btn', iconClass: 'ph-eye' },
            { class: 'add-cart-btn', iconClass: 'ph-shopping-bag-open', action: (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id, 1, 0); } }
        ];

        actionButtons.forEach(action => {
            const span = document.createElement('span');
            span.className = `${action.class} w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300 hover:bg-gray-100`;
            const icon = document.createElement('i');
            icon.className = `ph ${action.iconClass}`;
            span.appendChild(icon);

            if (action.action) {
                span.addEventListener('click', action.action);
            }

            listActionDiv.appendChild(span);
        });

        imgContainer.appendChild(listActionDiv);

        productItem.addEventListener('mouseover', () => {
            listActionDiv.style.opacity = '1';
        });

        productItem.addEventListener('mouseout', () => {
            listActionDiv.style.opacity = '0';
        });

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-infor', 'mt-4');

        const productName = document.createElement('span');
        productName.classList.add('text-title');
        productName.textContent = product.name;
        productInfo.appendChild(productName);

        const ratingContainer = document.createElement('div');
        ratingContainer.classList.add('flex', 'gap-0.5', 'mt-1');
        for (let i = 0; i < 5; i++) {
            const starIcon = document.createElement('i');
            starIcon.classList.add('ph-fill', 'ph-star', 'text-sm', 'text-yellow');
            ratingContainer.appendChild(starIcon);
        }
        productInfo.appendChild(ratingContainer);

        const productPrice = document.createElement('span');
        productPrice.classList.add('text-title', 'inline-block', 'mt-1');
        productPrice.textContent = `PKR ${product.price}`;


        productInfo.appendChild(productPrice);
        productItem.appendChild(imgContainer);
        productItem.appendChild(productInfo);
        productLink.appendChild(productItem);
        productList.appendChild(productLink);

    });
}
