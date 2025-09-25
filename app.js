/**
 * Microsoft Customer Stories Application
 * Loads and displays customer stories in a tile layout
 */

class CustomerStoriesApp {
    constructor() {
        this.stories = [];
        this.storiesGrid = document.getElementById('stories-grid');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.storyCount = document.getElementById('story-count');
        
        this.init();
    }

    async init() {
        try {
            await this.loadStories();
            this.renderStories();
        } catch (error) {
            this.showError(error);
        }
    }

    async loadStories() {
        try {
            const response = await fetch('customer_stories.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.stories = data.stories || [];
            
            // Update story count
            this.updateStoryCount(this.stories.length);
            
        } catch (error) {
            console.error('Error loading stories:', error);
            throw new Error('Failed to load customer stories');
        }
    }

    updateStoryCount(count) {
        if (this.storyCount) {
            this.storyCount.textContent = `${count} ${count === 1 ? 'story' : 'stories'} found`;
        }
    }

    renderStories() {
        // Hide loading spinner
        this.loading.style.display = 'none';
        
        if (this.stories.length === 0) {
            this.showError(new Error('No stories found'));
            return;
        }

        // Clear the grid
        this.storiesGrid.innerHTML = '';

        // Render each story
        this.stories.forEach((story, index) => {
            const storyCard = this.createStoryCard(story, index);
            this.storiesGrid.appendChild(storyCard);
        });

        // Animate cards in
        this.animateCardsIn();
    }

    createStoryCard(story, index) {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.style.animationDelay = `${index * 0.1}s`;

        // Handle missing image
        const imageUrl = story.image || 'https://via.placeholder.com/350x200/0078d4/ffffff?text=Microsoft+Customer+Story';
        
        // Create card HTML
        card.innerHTML = `
            ${story.image ? `<img src="${imageUrl}" alt="${this.escapeHtml(story.title)}" class="story-image" onerror="this.src='https://via.placeholder.com/350x200/0078d4/ffffff?text=Microsoft+Customer+Story'">` : ''}
            <div class="story-content">
                <h3 class="story-title">${this.escapeHtml(story.title || 'Untitled Story')}</h3>
                ${story.description ? `<p class="story-description">${this.escapeHtml(story.description)}</p>` : ''}
                
                ${story.company || story.industry ? `
                <div class="story-meta">
                    ${story.company ? `<span class="story-company">${this.escapeHtml(story.company)}</span>` : ''}
                    ${story.industry ? `<span class="story-industry">${this.escapeHtml(story.industry)}</span>` : ''}
                </div>
                ` : ''}
                
                <button class="read-story-btn" data-url="${this.escapeHtml(story.link || '#')}">
                    Read the story
                </button>
            </div>
        `;

        // Add click event to the entire card
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on the button directly
            if (!e.target.classList.contains('read-story-btn')) {
                this.handleStoryClick(story.link);
            }
        });

        // Add click event to the button
        const button = card.querySelector('.read-story-btn');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleStoryClick(story.link);
        });

        return card;
    }

    handleStoryClick(url) {
        if (!url || url === '#' || url === 'javascript:void(0)') {
            // Show demo message for placeholder links
            this.showDemoAlert();
            return;
        }

        // Open the story link in a new tab
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Optional: Track analytics
        this.trackStoryClick(url);
    }

    showDemoAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'demo-alert';
        alertDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                z-index: 1000;
                text-align: center;
                max-width: 400px;
                border: 2px solid #0078d4;
            ">
                <h3 style="color: #0078d4; margin-bottom: 1rem;">Demo Mode</h3>
                <p style="margin-bottom: 1.5rem; color: #605e5c;">
                    This is a demonstration. In a real implementation, this would redirect to the actual Microsoft customer story.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #0078d4;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">OK</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999;
            " onclick="this.parentElement.remove()"></div>
        `;
        
        document.body.appendChild(alertDiv);
    }

    trackStoryClick(url) {
        // In a real application, you might want to track clicks
        console.log('Story clicked:', url);
        
        // Example: Google Analytics tracking
        // gtag('event', 'story_click', {
        //     'event_category': 'engagement',
        //     'event_label': url
        // });
    }

    animateCardsIn() {
        const cards = this.storiesGrid.querySelectorAll('.story-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            }, index * 100);
        });
    }

    showError(error) {
        this.loading.style.display = 'none';
        this.error.style.display = 'block';
        this.storiesGrid.style.display = 'none';
        
        console.error('Customer Stories App Error:', error);
        
        // Update error message
        const errorP = this.error.querySelector('p');
        if (errorP) {
            errorP.textContent = error.message || 'An unexpected error occurred.';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Utility functions
const utils = {
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Unknown date';
        }
    },

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CustomerStoriesApp();
});

// Handle errors globally
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});