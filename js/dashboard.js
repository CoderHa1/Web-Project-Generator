document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
        return;
    }
    
    const userData = users[userIndex];
    
    // Update user info in the header
    document.getElementById('user-name').textContent = userData.name;
    
    // Update profile information
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-completed').textContent = userData.projectsCompleted || 0;
    document.getElementById('profile-hours').textContent = userData.totalHours || 0;
    
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
        mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close mobile menu when a navigation item is clicked
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    const views = document.querySelectorAll('.view');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const viewId = link.getAttribute('data-view');
            
            // Remove active class from all links and views
            navLinks.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            
            // Add active class to selected link and view
            link.classList.add('active');
            document.getElementById(viewId).classList.add('active');
            
            // Scroll to top when changing views
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Project idea generation
    const generateBtn = document.getElementById('generate-btn');
    const ideasContainer = document.getElementById('ideas-container');
    
    // Generate random project ideas dynamically
    generateBtn.addEventListener('click', () => {
        // Add loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        // Clear previous ideas
        ideasContainer.innerHTML = '';
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            // Generate 4 random project ideas
            const randomIdeas = generateMultipleIdeas(4);
            
            // Display ideas
            randomIdeas.forEach(idea => {
                const ideaCard = createIdeaCard(idea);
                ideasContainer.appendChild(ideaCard);
            });
            
            // Reset button
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate New Ideas';
        }, 600);
    });
    
    // Function to create a project idea card
    function createIdeaCard(idea) {
        const card = document.createElement('div');
        card.className = 'project-idea';
        card.setAttribute('data-difficulty', idea.difficulty);
        
        // Create difficulty badge
        const difficultyBadge = document.createElement('div');
        difficultyBadge.className = `difficulty-badge ${idea.difficulty.toLowerCase()}`;
        difficultyBadge.textContent = idea.difficulty;
        card.appendChild(difficultyBadge);
        
        const title = document.createElement('h3');
        title.textContent = idea.title;
        
        const description = document.createElement('p');
        description.textContent = idea.description;
        
        const details = document.createElement('div');
        details.className = 'idea-details';
        details.innerHTML = `
            <p><strong>Difficulty:</strong> ${idea.difficulty}</p>
            <p><strong>Estimated Duration:</strong> ${idea.duration}</p>
            <p><strong>Skills:</strong> ${idea.skills.join(', ')}</p>
        `;
        
        const selectBtn = document.createElement('button');
        selectBtn.className = 'btn btn-primary';
        selectBtn.innerHTML = '<i class="fas fa-plus"></i> Select Project';
        selectBtn.addEventListener('click', () => {
            addProjectToUser(idea);
        });
        
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(details);
        card.appendChild(selectBtn);
        
        // Add fade-in animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
        
        return card;
    }
    
    // Function to add project to user's current projects
    function addProjectToUser(project) {
        // Get updated user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            showToast('User not found!', 'error');
            return;
        }
        
        // Add project with additional info
        const newProject = {
            ...project,
            id: Date.now().toString(),
            startDate: new Date().toISOString(),
            status: 'in-progress'
        };
        
        // Make sure projects array exists
        if (!users[userIndex].projects) {
            users[userIndex].projects = [];
        }
        
        // Add project to user's projects
        users[userIndex].projects.push(newProject);
        
        // Save updated users data
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update UI
        renderUserProjects();
        
        // Show success message
        showToast(`"${project.title}" has been added to your projects!`, 'success');
        
        // Switch to My Projects view
        document.querySelector('nav a[data-view="my-projects"]').click();
    }
    
    // Toast notification function
    function showToast(message, type = 'info') {
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        
        // Add toast to the body
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Function to render user's current projects
    function renderUserProjects() {
        // Get updated user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            return;
        }
        
        const userData = users[userIndex];
        const currentProjects = userData.projects || [];
        const currentProjectsContainer = document.getElementById('current-projects');
        
        // Clear container
        currentProjectsContainer.innerHTML = '';
        
        if (currentProjects.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<i class="fas fa-info-circle"></i> You don\'t have any active projects yet. Generate and select a project idea to get started!';
            currentProjectsContainer.appendChild(emptyMessage);
            return;
        }
        
        // Render projects
        currentProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            const title = document.createElement('h3');
            title.textContent = project.title;
            
            const info = document.createElement('div');
            info.className = 'project-info';
            
            // Format date
            const startDate = new Date(project.startDate);
            const formattedDate = startDate.toLocaleDateString();
            
            info.innerHTML = `
                <p><strong><i class="fas fa-calendar-alt"></i> Started:</strong> ${formattedDate}</p>
                <p><strong><i class="fas fa-chart-line"></i> Difficulty:</strong> ${project.difficulty}</p>
                <p><strong><i class="fas fa-code"></i> Skills:</strong> ${project.skills.join(', ')}</p>
            `;
            
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'project-buttons';
            
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn btn-primary';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Complete';
            completeBtn.addEventListener('click', () => {
                openCompletionModal(project);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Project';
            deleteBtn.addEventListener('click', () => {
                confirmDeleteProject(project);
            });
            
            buttonsContainer.appendChild(completeBtn);
            buttonsContainer.appendChild(deleteBtn);
            
            projectCard.appendChild(title);
            projectCard.appendChild(info);
            projectCard.appendChild(buttonsContainer);
            
            currentProjectsContainer.appendChild(projectCard);
        });
    }
    
    // Function to render completed projects
    function renderCompletedProjects() {
        // Get updated user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            return;
        }
        
        const userData = users[userIndex];
        const completedProjects = userData.completedProjects || [];
        const completedProjectsContainer = document.getElementById('completed-projects');
        
        // Clear container
        completedProjectsContainer.innerHTML = '';
        
        if (completedProjects.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = '<i class="fas fa-info-circle"></i> You haven\'t completed any projects yet.';
            completedProjectsContainer.appendChild(emptyMessage);
            return;
        }
        
        // Render projects
        completedProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            const title = document.createElement('h3');
            title.textContent = project.title;
            
            const info = document.createElement('div');
            info.className = 'project-info';
            
            // Format dates
            const startDate = new Date(project.startDate);
            const completionDate = new Date(project.completionDate);
            
            info.innerHTML = `
                <p><strong><i class="fas fa-check-circle"></i> Completed on:</strong> ${completionDate.toLocaleDateString()}</p>
                <p><strong><i class="fas fa-clock"></i> Hours Spent:</strong> ${project.hoursSpent}</p>
                <p><strong><i class="fas fa-chart-line"></i> Difficulty:</strong> ${project.difficulty}</p>
                ${project.notes ? `<p><strong><i class="fas fa-sticky-note"></i> Notes:</strong> ${project.notes}</p>` : ''}
            `;
            
            projectCard.appendChild(title);
            projectCard.appendChild(info);
            
            completedProjectsContainer.appendChild(projectCard);
        });
    }
    
    // Project completion modal
    const completionModal = document.getElementById('completion-modal');
    const closeModalBtn = completionModal.querySelector('.close');
    const completionForm = document.getElementById('completion-form');
    let currentProjectId = null;
    
    // Open completion modal
    function openCompletionModal(project) {
        currentProjectId = project.id;
        completionModal.style.display = 'block';
        // Focus on hours input
        setTimeout(() => {
            document.getElementById('project-hours').focus();
        }, 300);
    }
    
    // Close modal functionality
    closeModalBtn.addEventListener('click', () => {
        completionModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === completionModal) {
            completionModal.style.display = 'none';
        }
    });
    
    // Handle project completion
    completionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const hoursSpent = parseFloat(document.getElementById('project-hours').value);
        const notes = document.getElementById('project-notes').value;
        const difficulty = document.getElementById('project-difficulty').value;
        
        if (isNaN(hoursSpent) || hoursSpent < 0) {
            showToast('Please enter a valid number of hours', 'error');
            return;
        }
        
        completeProject(currentProjectId, hoursSpent, notes, difficulty);
        completionModal.style.display = 'none';
        
        // Reset form
        completionForm.reset();
    });
    
    // Function to complete a project
    function completeProject(projectId, hoursSpent, notes, difficulty) {
        // Get updated user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            showToast('User not found!', 'error');
            return;
        }
        
        const userData = users[userIndex];
        
        // Find project in user's projects
        const projectIndex = userData.projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            showToast('Project not found!', 'error');
            return;
        }
        
        const project = userData.projects[projectIndex];
        
        // Create completed project
        const completedProject = {
            ...project,
            completionDate: new Date().toISOString(),
            hoursSpent,
            notes,
            difficulty
        };
        
        // Make sure completedProjects array exists
        if (!userData.completedProjects) {
            userData.completedProjects = [];
        }
        
        // Add to completed projects
        userData.completedProjects.push(completedProject);
        
        // Remove from current projects
        userData.projects.splice(projectIndex, 1);
        
        // Update user statistics
        userData.projectsCompleted = (userData.projectsCompleted || 0) + 1;
        userData.totalHours = (userData.totalHours || 0) + hoursSpent;
        
        // Update profile information
        document.getElementById('profile-completed').textContent = userData.projectsCompleted;
        document.getElementById('profile-hours').textContent = userData.totalHours;
        
        // Save updated users data
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update UI
        renderUserProjects();
        renderCompletedProjects();
        
        // Show success message with confetti effect
        showToast(`Congratulations! You have completed the "${project.title}" project!`, 'success');
        
        // Switch to Completed Projects view
        document.querySelector('nav a[data-view="completed"]').click();
    }
    
    // Initial rendering
    renderUserProjects();
    renderCompletedProjects();
    
    // Generate initial ideas when dashboard loads
    generateBtn.click();
    
    // Add CSS for toast notifications
    addToastStyles();
    
    function addToastStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                min-width: 300px;
                background-color: white;
                color: var(--gray-800);
                padding: 0;
                border-radius: var(--border-radius);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                z-index: 9999;
            }
            
            .toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                padding: 16px;
            }
            
            .toast i {
                margin-right: 12px;
                font-size: 1.4rem;
            }
            
            .toast.success i {
                color: #4ade80;
            }
            
            .toast.error i {
                color: #ef4444;
            }
            
            .toast.info i {
                color: #3b82f6;
            }
            
            .toast-progress {
                height: 4px;
                background-color: rgba(0, 0, 0, 0.1);
                width: 100%;
                position: relative;
            }
            
            .toast-progress::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: var(--primary-color);
                animation: progress 3s linear forwards;
            }
            
            @keyframes progress {
                0% { width: 100%; }
                100% { width: 0%; }
            }
            
            @media (max-width: 576px) {
                .toast {
                    left: 20px;
                    right: 20px;
                    min-width: unset;
                    max-width: calc(100% - 40px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Function to show delete confirmation
    function confirmDeleteProject(project) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal';
        modalOverlay.style.display = 'block';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content delete-modal';
        
        // Add modal content
        modalContent.innerHTML = `
            <span class="close">&times;</span>
            <h2>Delete Project</h2>
            <p>Are you sure you want to delete "${project.title}"?</p>
            <p class="delete-warning"><i class="fas fa-exclamation-triangle"></i> This action cannot be undone.</p>
            <div class="modal-buttons">
                <button class="btn btn-secondary cancel-btn"><i class="fas fa-times"></i> Cancel</button>
                <button class="btn btn-danger confirm-delete-btn"><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
        `;
        
        // Append modal to body
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Add event listeners
        const closeBtn = modalContent.querySelector('.close');
        const cancelBtn = modalContent.querySelector('.cancel-btn');
        const confirmBtn = modalContent.querySelector('.confirm-delete-btn');
        
        // Close modal function
        const closeModal = () => {
            modalOverlay.style.display = 'none';
            setTimeout(() => {
                modalOverlay.remove();
            }, 300);
        };
        
        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            deleteProject(project.id);
            closeModal();
        });
        
        // Close when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // Add delete modal styles
        const deleteModalStyle = document.createElement('style');
        deleteModalStyle.textContent = `
            .delete-modal {
                max-width: 450px;
            }
            
            .delete-warning {
                color: var(--danger-color);
                font-weight: var(--font-weight-medium);
                margin: 1rem 0;
            }
            
            .delete-warning i {
                margin-right: 0.5rem;
            }
            
            .modal-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .btn-secondary {
                background-color: var(--gray-500);
                color: white;
            }
            
            .btn-secondary:hover {
                background-color: var(--gray-600);
                transform: translateY(-2px);
            }
            
            .btn-danger {
                background-color: var(--danger-color);
                color: white;
            }
            
            .btn-danger:hover {
                background-color: #d90166;
                transform: translateY(-2px);
            }
            
            .project-buttons {
                display: flex;
                gap: 1rem;
                margin-top: auto;
            }
            
            .project-buttons .btn {
                flex: 1;
            }
            
            @media (max-width: 576px) {
                .project-buttons {
                    flex-direction: column;
                    gap: 0.5rem;
                }
            }
        `;
        document.head.appendChild(deleteModalStyle);
    }
    
    // Function to delete a project
    function deleteProject(projectId) {
        // Get updated user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            showToast('User not found!', 'error');
            return;
        }
        
        const userData = users[userIndex];
        
        // Find project in user's projects
        const projectIndex = userData.projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) {
            showToast('Project not found!', 'error');
            return;
        }
        
        const projectTitle = userData.projects[projectIndex].title;
        
        // Remove project
        userData.projects.splice(projectIndex, 1);
        
        // Save updated users data
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update UI
        renderUserProjects();
        
        // Show success message
        showToast(`"${projectTitle}" has been deleted`, 'success');
    }
}); 