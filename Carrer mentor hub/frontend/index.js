document.addEventListener("DOMContentLoaded", function () {
  async function fetchAndRenderReviews() {
    try {
      const response = await fetch("http://localhost:3000/reviews");
      const data = await response.json();
      const reviews = data;
      console.log(data);

      const ul = document.getElementById("carousel");

      reviews.forEach((review) => {
        const li = document.createElement("li");
        li.className = "card";
        // Image div
        const div1 = document.createElement("div");
        div1.className = "img";

        const img = document.createElement("img");
        img.src = "logo.jpg";
        img.alt = "";
        img.draggable = "false";

        //div1.appendChild(img);

        // Text elements
        const p = document.createElement("p");
        p.className = "review-text";
        p.textContent = `${review.review}`;

        const div2 = document.createElement("div");
        div2.className = "stars";
        div2.textContent =
          "★".repeat(review.stars) + "☆".repeat(5 - review.stars);

        const span = document.createElement("span");
        span.textContent = review.reviewer_name;

        // Append to li
        li.appendChild(div1);
        li.appendChild(div2);
        li.appendChild(p);

        li.appendChild(span);

        // Add li to ul
        ul.appendChild(li);
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }

    const carousel = document.querySelector(".carousel");
    const arrowBtns = document.querySelectorAll(".wrapper i");
    const wrapper = document.querySelector(".wrapper");

    const firstCard = carousel.querySelector(".card");
    const firstCardWidth = firstCard.offsetWidth;

    let isDragging = false,
      startX,
      startScrollLeft,
      timeoutId;

    const dragStart = (e) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
      if (!isDragging) return;

      // Calculate the new scroll position
      const newScrollLeft = startScrollLeft - (e.pageX - startX);

      // Check if the new scroll position exceeds
      // the carousel boundaries
      if (
        newScrollLeft <= 0 ||
        newScrollLeft >= carousel.scrollWidth - carousel.offsetWidth
      ) {
        // If so, prevent further dragging
        isDragging = false;
        return;
      }

      // Otherwise, update the scroll position of the carousel
      carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    };

    const autoPlay = () => {
      // Return if window is smaller than 800
      if (window.innerWidth < 800) return;

      // Calculate the total width of all cards
      const totalCardWidth = carousel.scrollWidth;

      // Calculate the maximum scroll position
      const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

      // If the carousel is at the end, stop autoplay
      if (carousel.scrollLeft >= maxScrollLeft) return;

      // Autoplay the carousel after every 2500ms
      timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 1);
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    //wrapper.addEventListener("mouseleave", autoPlay);

    // Add event listeners for the arrow buttons to
    // scroll the carousel left and right
    arrowBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft +=
          btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });

    setInterval(autoPlay, 3500);
  }

  // Call the function
  fetchAndRenderReviews();
});

document.addEventListener("DOMContentLoaded", function () {
  async function fetchAndRenderAnnouncements() {
    try {
      const response = await fetch("http://localhost:3000/announcements");
      const data = await response.json();
      const announcements = data;
      console.log(data);

      const ul = document.getElementById("announcement-carousel");

      announcements.forEach((announcement) => {
        const li = document.createElement("li");
        li.className = "card";

        const announcement_card = document.createElement("div");
        announcement_card.className = "announcement-card";

        const card_header = document.createElement("div");
        card_header.className = "card-header";

        const header_top = document.createElement("div");
        header_top.className = "header-top";

        const header_left = document.createElement("div");
        header_left.className = "header-left";

        const icon_wrapper = document.createElement("div");
        icon_wrapper.className = "icon-wrapper";

        const bell_icon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        bell_icon.setAttribute("class", "bell-icon");
        bell_icon.setAttribute("viewBox", "0 0 24 24");

        const svgNS = "http://www.w3.org/2000/svg";
        const path1 = document.createElementNS(svgNS, "path");
        path1.setAttribute("d", "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9");
        bell_icon.appendChild(path1);

        const path2 = document.createElementNS(svgNS, "path");
        path2.setAttribute("d", "M13.73 21a2 2 0 0 1-3.46 0");
        bell_icon.appendChild(path2);

        icon_wrapper.appendChild(bell_icon);

        const header_content = document.createElement("div");
        header_content.className = "header-content";

        const h3 = document.createElement("h3");
        h3.textContent = "New Announcement";

        header_content.appendChild(h3);

        const date_info = document.createElement("div");
        date_info.className = "date-info";

        const calendar_icon = document.createElementNS(svgNS, "svg");
        calendar_icon.setAttribute("class", "calendar-icon");
        calendar_icon.setAttribute("viewBox", "0 0 24 24");

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", "3");
        rect.setAttribute("y", "4");
        rect.setAttribute("width", "18");
        rect.setAttribute("height", "18");
        rect.setAttribute("rx", "2");
        rect.setAttribute("ry", "2");
        calendar_icon.appendChild(rect);

        // Create first <line>
        const line1 = document.createElementNS(svgNS, "line");
        line1.setAttribute("x1", "16");
        line1.setAttribute("y1", "2");
        line1.setAttribute("x2", "16");
        line1.setAttribute("y2", "6");
        calendar_icon.appendChild(line1);

        // Create second <line>
        const line2 = document.createElementNS(svgNS, "line");
        line2.setAttribute("x1", "8");
        line2.setAttribute("y1", "2");
        line2.setAttribute("x2", "8");
        line2.setAttribute("y2", "6");
        calendar_icon.appendChild(line2);

        // Create third <line>
        const line3 = document.createElementNS(svgNS, "line");
        line3.setAttribute("x1", "3");
        line3.setAttribute("y1", "10");
        line3.setAttribute("x2", "21");
        line3.setAttribute("y2", "10");
        calendar_icon.appendChild(line3);

        date_info.appendChild(calendar_icon);

        const span = document.createElement("span");
        span.style.color = "white";
        span.textContent = announcement.announcement_date;

        date_info.appendChild(span);

        header_content.appendChild(date_info);

        header_left.appendChild(icon_wrapper);
        header_left.appendChild(header_content);

        const new_badge = document.createElement("div");
        new_badge.className = "new-badge";
        new_badge.textContent = "NEW";

        header_top.appendChild(header_left);
        header_top.appendChild(new_badge);

        card_header.appendChild(header_top);

        //Content

        const card_content = document.createElement("div");
        card_content.className = "card-content";

        const content_title = document.createElement("h4");
        content_title.className = "content-title";
        content_title.textContent = announcement.announcement_heading;

        // Create <p> with class "content-text"
        const content_text = document.createElement("p");
        content_text.className = "content-text";
        content_text.textContent = announcement.announcement;

        // Create <a> with class "read-more-btn" and href "#"
        const read_more_btn = document.createElement("a");
        read_more_btn.className = "read-more-btn";
        read_more_btn.href = "#";

        // Create inner <span> inside <a>
        const content_span = document.createElement("span");
        content_span.textContent = "Read more details";
        read_more_btn.appendChild(content_span);

        // Create <svg> inside <a>
        const arrow_icon = document.createElementNS(svgNS, "svg");
        arrow_icon.setAttribute("class", "arrow-icon");
        arrow_icon.setAttribute("viewBox", "0 0 24 24");

        // Create <line> inside svg
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", "5");
        line.setAttribute("y1", "12");
        line.setAttribute("x2", "19");
        line.setAttribute("y2", "12");
        arrow_icon.appendChild(line);

        // Create <polyline> inside svg
        const polyline = document.createElementNS(svgNS, "polyline");
        polyline.setAttribute("points", "12,5 19,12 12,19");
        arrow_icon.appendChild(polyline);

        // Append svg to <a>
        read_more_btn.appendChild(arrow_icon);

        card_content.appendChild(content_title);
        card_content.appendChild(content_text);
        card_content.appendChild(read_more_btn);

        //Footer

        // Create <div class="card-footer">
        const card_Footer = document.createElement("div");
        card_Footer.className = "card-footer";

        // Create <div class="priority-info">
        const priority_Info = document.createElement("div");
        priority_Info.className = "priority-info";

        // Create <div class="priority-dot">
        const priority_Dot = document.createElement("div");
        priority_Dot.className = "priority-dot";

        // Create <span class="priority-text">Medium Priority</span>
        const priority_Text = document.createElement("span");
        priority_Text.className = "priority-text";
        priority_Text.textContent = announcement.priority;

        // Append priorityDot and priorityText to priorityInfo
        priority_Info.appendChild(priority_Dot);
        priority_Info.appendChild(priority_Text);

        // Create <span class="author-info">Posted by Admin</span>
        const author_Info = document.createElement("span");
        author_Info.className = "author-info";
        author_Info.textContent = "Posted by Admin";

        // Append priorityInfo and authorInfo to cardFooter
        card_Footer.appendChild(priority_Info);
        card_Footer.appendChild(author_Info);

        // Now you can append cardFooter to a parent element, for example:
        // document.body.appendChild(cardFooter);

        announcement_card.appendChild(card_header);
        announcement_card.appendChild(card_content);
        announcement_card.appendChild(card_Footer);

        li.appendChild(announcement_card);

        // Add li to ul
        ul.appendChild(li);
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }

    const carousel = document.querySelector(".announcement-carousel");
    const arrowBtns = document.querySelectorAll(".announcement-wrapper i");
    const wrapper = document.querySelector(".announcement-wrapper");

    const firstCard = carousel.querySelector(".card");
    const firstCardWidth = firstCard.offsetWidth;
    console.log(firstCardWidth);

    let isDragging = false,
      startX,
      startScrollLeft,
      timeoutId;

    const dragStart = (e) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
      if (!isDragging) return;

      // Calculate the new scroll position
      const newScrollLeft = startScrollLeft - (e.pageX - startX);

      // Check if the new scroll position exceeds
      // the carousel boundaries
      if (
        newScrollLeft <= 0 ||
        newScrollLeft >= carousel.scrollWidth - carousel.offsetWidth
      ) {
        // If so, prevent further dragging
        isDragging = false;
        return;
      }

      // Otherwise, update the scroll position of the carousel
      carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    };

    const autoPlay = () => {
      // Return if window is smaller than 800
      if (window.innerWidth < 800) return;

      // Calculate the total width of all cards
      const totalCardWidth = carousel.scrollWidth;

      // Calculate the maximum scroll position
      const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

      // If the carousel is at the end, stop autoplay
      if (carousel.scrollLeft >= maxScrollLeft) return;

      // Autoplay the carousel after every 2500ms
      timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 1);
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    //wrapper.addEventListener("mouseleave", autoPlay);

    // Add event listeners for the arrow buttons to
    // scroll the carousel left and right
    arrowBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft +=
          btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });

    setInterval(autoPlay, 5000);
  }

  // Call the function
  fetchAndRenderAnnouncements();
});
